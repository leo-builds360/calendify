-- ============================================================
-- Calendify – Initial Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendars
CREATE TABLE IF NOT EXISTS calendars (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  owner_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendar members (many-to-many)
CREATE TABLE IF NOT EXISTS calendar_members (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID        NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (calendar_id, user_id)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID        NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  all_day     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by  UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendar invites
CREATE TABLE IF NOT EXISTS calendar_invites (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id    UUID        NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  token          TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_email  TEXT,
  created_by     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at     TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  used           BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_calendar_members_user_id     ON calendar_members (user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_members_calendar_id ON calendar_members (calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id           ON events (calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date            ON events (start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_invites_token       ON calendar_invites (token);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars        ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_invites ENABLE ROW LEVEL SECURITY;

-- ── Profiles ────────────────────────────────────────────────

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_members"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT cm2.user_id FROM calendar_members cm2
      WHERE cm2.calendar_id IN (
        SELECT cm1.calendar_id FROM calendar_members cm1 WHERE cm1.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Calendars ───────────────────────────────────────────────

CREATE POLICY "calendars_select_members"
  ON calendars FOR SELECT
  USING (
    id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

CREATE POLICY "calendars_insert_owner"
  ON calendars FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "calendars_update_members"
  ON calendars FOR UPDATE
  USING (
    id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

CREATE POLICY "calendars_delete_owner"
  ON calendars FOR DELETE
  USING (auth.uid() = owner_id);

-- ── Calendar Members ─────────────────────────────────────────

CREATE POLICY "calendar_members_select"
  ON calendar_members FOR SELECT
  USING (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

-- Members can add other members; anyone can add themselves (invite flow uses service role)
CREATE POLICY "calendar_members_insert"
  ON calendar_members FOR INSERT
  WITH CHECK (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
    OR auth.uid() = user_id
  );

CREATE POLICY "calendar_members_delete"
  ON calendar_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR calendar_id IN (SELECT id FROM calendars WHERE owner_id = auth.uid())
  );

-- ── Events ──────────────────────────────────────────────────

CREATE POLICY "events_select_members"
  ON events FOR SELECT
  USING (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

CREATE POLICY "events_insert_members"
  ON events FOR INSERT
  WITH CHECK (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
    AND auth.uid() = created_by
  );

CREATE POLICY "events_update_members"
  ON events FOR UPDATE
  USING (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

CREATE POLICY "events_delete_members"
  ON events FOR DELETE
  USING (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

-- ── Calendar Invites ─────────────────────────────────────────

-- Members can view invites for their calendars
CREATE POLICY "invites_select_members"
  ON calendar_invites FOR SELECT
  USING (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
  );

-- Any authenticated user can view an invite by token (for acceptance page)
CREATE POLICY "invites_select_by_token"
  ON calendar_invites FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "invites_insert_members"
  ON calendar_invites FOR INSERT
  WITH CHECK (
    calendar_id IN (SELECT calendar_id FROM calendar_members WHERE user_id = auth.uid())
    AND auth.uid() = created_by
  );

-- Service role handles UPDATE (marking used) via server action
CREATE POLICY "invites_update_authenticated"
  ON calendar_invites FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- HELPER: get invite details by token (SECURITY DEFINER)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_invite_by_token(p_token TEXT)
RETURNS TABLE (
  invite_id    UUID,
  calendar_id  UUID,
  calendar_name TEXT,
  invited_email TEXT,
  expires_at   TIMESTAMPTZ,
  used         BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ci.id           AS invite_id,
    ci.calendar_id,
    c.name          AS calendar_name,
    ci.invited_email,
    ci.expires_at,
    ci.used
  FROM calendar_invites ci
  JOIN calendars c ON c.id = ci.calendar_id
  WHERE ci.token = p_token;
END;
$$;

-- Grant execute to authenticated and anon roles
GRANT EXECUTE ON FUNCTION public.get_invite_by_token(TEXT) TO anon, authenticated;
