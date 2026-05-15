import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users } from 'lucide-react'
import InviteModal from '@/components/invites/invite-modal'
import MemberAvatar from '@/components/member-avatar'
import CalendarDynamic from '@/components/calendar/calendar-dynamic'
import type { CalendarEvent } from '@/lib/types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('calendars').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Calendar' }
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch calendar + verify membership
  const { data: calendar, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !calendar) notFound()

  // Verify user is a member (RLS enforces this but we handle 404 gracefully)
  const { data: membership } = await supabase
    .from('calendar_members')
    .select('id')
    .eq('calendar_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) notFound()

  // Fetch events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('calendar_id', id)
    .order('start_date', { ascending: true })

  // Fetch members + profiles
  const { data: members } = await supabase
    .from('calendar_members')
    .select(`
      user_id, joined_at,
      profiles ( id, email, full_name )
    `)
    .eq('calendar_id', id)

  const isOwner = calendar.owner_id === user.id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-gray-200 text-[#6e6e73] hover:text-[#1d1d1f] hover:border-gray-300 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight truncate">
              {calendar.name}
            </h1>
            {calendar.description && (
              <p className="text-[13px] text-[#6e6e73] truncate">{calendar.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Member avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {(members ?? []).slice(0, 4).map((m) => {
                const prof = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
                return (
                  <MemberAvatar
                    key={m.user_id}
                    profile={prof as { id: string; email: string; full_name: string | null } | null}
                  />
                )
              })}
            </div>
            {(members ?? []).length > 4 && (
              <span className="ml-2 text-[12px] text-[#6e6e73]">
                +{(members ?? []).length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[12px] text-[#6e6e73]">
            <Users className="w-3.5 h-3.5" />
            {(members ?? []).length}
          </div>

          <InviteModal calendarId={id} calendarName={calendar.name} />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-sm">
        <CalendarDynamic
          events={(events ?? []) as CalendarEvent[]}
          calendarId={id}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}

