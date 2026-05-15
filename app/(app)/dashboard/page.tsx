import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Plus, Users, Clock } from 'lucide-react'
import CreateCalendarModal from '@/components/calendar/create-calendar-modal'
import type { Calendar } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('calendar_members')
    .select(`
      joined_at,
      calendars (
        id, name, description, owner_id, created_at
      )
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  const calendars = (memberships ?? [])
    .map((m) => (Array.isArray(m.calendars) ? m.calendars[0] : m.calendars))
    .filter(Boolean) as Calendar[]

  const calendarIds = calendars.map((c) => c.id)
  const { data: memberCounts } = await supabase
    .from('calendar_members')
    .select('calendar_id')
    .in('calendar_id', calendarIds.length > 0 ? calendarIds : ['none'])

  const countMap: Record<string, number> = {}
  for (const row of memberCounts ?? []) {
    countMap[row.calendar_id] = (countMap[row.calendar_id] ?? 0) + 1
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">
            Mes calendriers
          </h1>
          <p className="text-[14px] text-[#6e6e73] mt-0.5">
            {calendars.length === 0
              ? 'Créez votre premier calendrier partagé'
              : `${calendars.length} calendrier${calendars.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <CreateCalendarModal />
      </div>

      {/* Calendar grid */}
      {calendars.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calendars.map((calendar) => (
            <CalendarCard
              key={calendar.id}
              calendar={calendar}
              memberCount={countMap[calendar.id] ?? 1}
              isOwner={calendar.owner_id === user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CalendarCard({
  calendar,
  memberCount,
  isOwner,
}: {
  calendar: Calendar
  memberCount: number
  isOwner: boolean
}) {
  return (
    <Link href={`/calendar/${calendar.id}`}>
      <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#0071e3]/30 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0071e3]/20 transition-colors">
            <CalendarDays className="w-5 h-5 text-[#0071e3]" />
          </div>
          {isOwner && (
            <span className="text-[11px] font-medium bg-[#f5f5f7] text-[#6e6e73] px-2 py-0.5 rounded-full">
              Propriétaire
            </span>
          )}
        </div>
        <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-1 group-hover:text-[#0071e3] transition-colors">
          {calendar.name}
        </h3>
        {calendar.description && (
          <p className="text-[13px] text-[#6e6e73] mb-3 line-clamp-2">
            {calendar.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-[12px] text-[#8e8e93]">
            <Users className="w-3.5 h-3.5" />
            {memberCount} membre{memberCount > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[#8e8e93]">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(calendar.created_at), { addSuffix: true, locale: fr })}
          </div>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-[#f5f5f7] rounded-3xl flex items-center justify-center mb-5">
        <CalendarDays className="w-10 h-10 text-[#8e8e93]" />
      </div>
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">
        Aucun calendrier
      </h2>
      <p className="text-[14px] text-[#6e6e73] mb-6 max-w-xs">
        Créez votre premier calendrier partagé et collaborez avec votre équipe ou votre famille.
      </p>
      <CreateCalendarModal variant="empty" />
    </div>
  )
}
