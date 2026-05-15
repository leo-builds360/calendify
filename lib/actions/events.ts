'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface EventPayload {
  calendar_id: string
  title: string
  description?: string | null
  start_date: string
  end_date: string
  all_day: boolean
}

export async function createEvent(payload: EventPayload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('events').insert({
    ...payload,
    created_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/calendar/${payload.calendar_id}`)
  return { success: true }
}

export async function updateEvent(
  eventId: string,
  payload: Partial<EventPayload>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('calendar_id')
    .eq('id', eventId)
    .single()

  if (fetchError || !event) return { error: 'Event not found' }

  const { error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', eventId)

  if (error) return { error: error.message }

  revalidatePath(`/calendar/${event.calendar_id}`)
  return { success: true }
}

export async function deleteEvent(eventId: string, calendarId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('events').delete().eq('id', eventId)

  if (error) return { error: error.message }

  revalidatePath(`/calendar/${calendarId}`)
  return { success: true }
}
