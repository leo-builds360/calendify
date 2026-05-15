# Calendify – Shared Calendar App

A production-quality collaborative calendar web app built with Next.js 15, Supabase, and FullCalendar. Inspired by Apple's design philosophy.

## Tech Stack

- **Next.js 15** – App Router, Server Components, Server Actions
- **TypeScript** – Full type safety
- **TailwindCSS** – Apple-inspired styling
- **shadcn/ui** – Radix UI primitives
- **Supabase** – Auth, Postgres, Row Level Security
- **FullCalendar** – Month/Week/Day views with drag & drop
- **Sonner** – Toast notifications
- **date-fns** – Date utilities

## Features

- Email/password auth with email verification
- Create and manage shared calendars
- Invite members via secure token links
- Create, edit, delete events (title, description, start/end, all-day)
- FullCalendar with Month, Week, Day views
- Drag and drop event rescheduling
- Row Level Security — users only access their calendars

## Local Development

### 1. Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### 2. Clone and install

```bash
git clone <your-repo>
cd calendify
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in your Supabase project under **Settings → API**.

### 4. Run the database migration

In the Supabase dashboard, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

Or with the Supabase CLI:

```bash
npx supabase db push
```

### 5. Configure Supabase Auth

In your Supabase project:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000`
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL (e.g. `https://calendify.vercel.app`)

### 3. Update Supabase Auth settings

After deployment, in Supabase:

1. **Authentication → URL Configuration**
2. Update **Site URL** to your Vercel URL
3. Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

### 4. Deploy

Vercel will auto-deploy on every push to `main`.

## Project Structure

```
calendify/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, confirm)
│   ├── (app)/               # Protected app pages
│   │   ├── dashboard/       # Calendar list
│   │   └── calendar/[id]/   # Calendar view
│   ├── auth/callback/       # Supabase auth callback
│   ├── invite/[token]/      # Invite acceptance page
│   └── page.tsx             # Landing page
├── components/
│   ├── calendar/            # Calendar-specific components
│   ├── events/              # Event modal
│   ├── invites/             # Invite modal & accept button
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── actions/             # Server actions
│   ├── supabase/            # Supabase clients
│   ├── types/               # TypeScript types
│   └── utils.ts             # Utility functions
└── supabase/
    └── migrations/          # SQL migrations
```

## Key Architecture Decisions

- **Server Components** for data fetching (dashboard, calendar page)
- **Server Actions** for all mutations (create/edit/delete events, invites)
- **`dynamic(() => ..., { ssr: false })`** for FullCalendar (avoids SSR issues)
- **Service Role** used server-side for invite token lookups (bypasses RLS securely)
- **SECURITY DEFINER** SQL function for safe invite lookups from any auth state

## License

MIT
