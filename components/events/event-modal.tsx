'use client'

import { useState, useTransition, useEffect } from 'react'
import { X, Trash2, Calendar, Clock, AlignLeft } from 'lucide-react'
import { createEvent, updateEvent, deleteEvent } from '@/lib/actions/events'
import { toast } from 'sonner'
import type { CalendarEvent } from '@/lib/types'
import { format, parseISO, addHours } from 'date-fns'

interface EventModalProps {
  open: boolean
  onClose: () => void
  event: CalendarEvent | null
  calendarId: string
  defaultDate?: string
  currentUserId: string
}

function toDateTimeLocal(iso: string) {
  return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm")
}

function toDateLocal(iso: string) {
  return format(parseISO(iso), 'yyyy-MM-dd')
}

function defaultStart(dateStr?: string): string {
  const base = dateStr ? new Date(dateStr) : new Date()
  base.setMinutes(0, 0, 0)
  return format(base, "yyyy-MM-dd'T'HH:mm")
}

function defaultEnd(dateStr?: string): string {
  const base = dateStr ? new Date(dateStr) : new Date()
  base.setMinutes(0, 0, 0)
  const end = addHours(base, 1)
  return format(end, "yyyy-MM-dd'T'HH:mm")
}

export default function EventModal({
  open,
  onClose,
  event,
  calendarId,
  defaultDate,
  currentUserId,
}: EventModalProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const [allDay, setAllDay] = useState(false)

  const isEditing = !!event

  // Populate form when event changes
  useEffect(() => {
    if (event) setAllDay(event.all_day)
    else setAllDay(false)
  }, [event])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const title = data.get('title') as string
    const description = data.get('description') as string
    const startRaw = data.get('start_date') as string
    const endRaw = data.get('end_date') as string

    if (!title?.trim()) {
      toast.error('Title is required')
      return
    }

    const start_date = allDay
      ? new Date(startRaw + 'T00:00:00').toISOString()
      : new Date(startRaw).toISOString()
    const end_date = allDay
      ? new Date(endRaw + 'T23:59:59').toISOString()
      : new Date(endRaw).toISOString()

    if (new Date(end_date) <= new Date(start_date) && !allDay) {
      toast.error('End time must be after start time')
      return
    }

    const payload = {
      calendar_id: calendarId,
      title: title.trim(),
      description: description?.trim() || null,
      start_date,
      end_date,
      all_day: allDay,
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateEvent(event.id, payload)
        : await createEvent(payload)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? 'Event updated' : 'Event created')
        onClose()
      }
    })
  }

  const handleDelete = () => {
    if (!event) return
    startDeleting(async () => {
      const result = await deleteEvent(event.id, calendarId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Event deleted')
        onClose()
      }
    })
  }

  const startDefault = event
    ? allDay
      ? toDateLocal(event.start_date)
      : toDateTimeLocal(event.start_date)
    : allDay
    ? defaultDate ?? format(new Date(), 'yyyy-MM-dd')
    : defaultStart(defaultDate)

  const endDefault = event
    ? allDay
      ? toDateLocal(event.end_date)
      : toDateTimeLocal(event.end_date)
    : allDay
    ? defaultDate ?? format(new Date(), 'yyyy-MM-dd')
    : defaultEnd(defaultDate)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-[#1d1d1f]">
            {isEditing ? 'Edit event' : 'New event'}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#f5f5f7] text-[#6e6e73] hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#8e8e93] mt-2.5 shrink-0" />
            <input
              name="title"
              type="text"
              required
              autoFocus
              defaultValue={event?.title ?? ''}
              placeholder="Event title"
              className="flex-1 text-[16px] font-medium text-[#1d1d1f] bg-transparent border-b border-gray-200 pb-2 focus:outline-none focus:border-[#0071e3] placeholder:text-[#c7c7cc] placeholder:font-normal"
            />
          </div>

          {/* All day toggle */}
          <div className="flex items-center justify-between bg-[#f5f5f7] rounded-xl px-4 py-3">
            <span className="text-[13px] font-medium text-[#1d1d1f]">All day</span>
            <button
              type="button"
              onClick={() => setAllDay((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                allDay ? 'bg-[#0071e3]' : 'bg-[#d1d1d6]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  allDay ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dates */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#8e8e93] mt-2.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-[#8e8e93] uppercase tracking-wider mb-1">
                  Start
                </label>
                <input
                  key={`start-${allDay}`}
                  name="start_date"
                  type={allDay ? 'date' : 'datetime-local'}
                  required
                  defaultValue={startDefault}
                  className="w-full h-9 px-3 text-[13px] bg-[#f5f5f7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#8e8e93] uppercase tracking-wider mb-1">
                  End
                </label>
                <input
                  key={`end-${allDay}`}
                  name="end_date"
                  type={allDay ? 'date' : 'datetime-local'}
                  required
                  defaultValue={endDefault}
                  className="w-full h-9 px-3 text-[13px] bg-[#f5f5f7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <AlignLeft className="w-4 h-4 text-[#8e8e93] mt-2.5 shrink-0" />
            <textarea
              name="description"
              rows={3}
              defaultValue={event?.description ?? ''}
              placeholder="Add description…"
              className="flex-1 text-[14px] text-[#1d1d1f] bg-[#f5f5f7] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071e3] resize-none placeholder:text-[#c7c7cc] transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium rounded-xl hover:bg-[#e8e8ed] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
