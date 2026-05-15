'use client'

import dynamic from 'next/dynamic'
import type { CalendarEvent } from '@/lib/types'

const CalendarView = dynamic(() => import('./calendar-view'), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
})

interface CalendarDynamicProps {
  events: CalendarEvent[]
  calendarId: string
  currentUserId: string
}

export default function CalendarDynamic(props: CalendarDynamicProps) {
  return <CalendarView {...props} />
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-100 rounded-lg w-36" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-100 rounded-lg w-20" />
          <div className="h-8 bg-gray-100 rounded-lg w-20" />
          <div className="h-8 bg-gray-100 rounded-lg w-20" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white h-8" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-white h-24" />
        ))}
      </div>
    </div>
  )
}
