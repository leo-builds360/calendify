export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Calendar {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
}

export interface CalendarMember {
  id: string
  calendar_id: string
  user_id: string
  joined_at: string
  profiles?: Profile
}

export interface CalendarEvent {
  id: string
  calendar_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  all_day: boolean
  created_by: string | null
  created_at: string
  profiles?: Profile
}

export interface CalendarInvite {
  id: string
  calendar_id: string
  token: string
  invited_email: string | null
  created_by: string
  expires_at: string
  used: boolean
  created_at: string
}

export interface InviteDetails {
  invite_id: string
  calendar_id: string
  calendar_name: string
  invited_email: string | null
  expires_at: string
  used: boolean
}

export interface CalendarWithMembers extends Calendar {
  calendar_members: Array<{
    user_id: string
    profiles: Profile | null
  }>
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
