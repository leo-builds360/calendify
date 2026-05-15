'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventInput, EventDropArg } from '@fullcalendar/core'
import { updateEvent } from '@/lib/actions/events'
import { toast } from 'sonner'
import type { CalendarEvent } from '@/lib/types'
import EventModal from '@/components/events/event-modal'

interface CalendarViewProps {
  events: CalendarEvent[]
  calendarId: string
  currentUserId: string
}

export default function CalendarView({ events, calendarId, currentUserId }: CalendarViewProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)

  const fcEvents: EventInput[] = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    start: ev.start_date,
    end: ev.end_date,
    allDay: ev.all_day,
    backgroundColor: '#0071e3',
    borderColor: '#0071e3',
    extendedProps: ev,
  }))

  const handleDateClick = useCallback((info: DateClickArg) => {
    setSelectedEvent(null)
    setDefaultDate(info.dateStr)
    setModalOpen(true)
  }, [])

  const handleEventClick = useCallback((info: EventClickArg) => {
    const ev = info.event.extendedProps as CalendarEvent
    setSelectedEvent({ ...ev, id: info.event.id, title: info.event.title })
    setDefaultDate(undefined)
    setModalOpen(true)
  }, [])

  const handleEventDrop = useCallback(async (info: EventDropArg) => {
    const start = info.event.start
    const end = info.event.end ?? info.event.start

    if (!start) return

    const result = await updateEvent(info.event.id, {
      start_date: start.toISOString(),
      end_date: end!.toISOString(),
      all_day: info.event.allDay,
    })

    if (result?.error) {
      info.revert()
      toast.error("Impossible de déplacer l'événement")
    } else {
      toast.success('Événement déplacé')
    }
  }, [])

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={fcEvents}
        editable
        selectable
        selectMirror
        dayMaxEvents={3}
        height="auto"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        }}
      />

      <EventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedEvent(null)
          setDefaultDate(undefined)
        }}
        event={selectedEvent}
        calendarId={calendarId}
        defaultDate={defaultDate}
        currentUserId={currentUserId}
      />
    </>
  )
}
