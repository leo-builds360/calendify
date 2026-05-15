'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCalendar(formData: FormData) {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) return { error: 'Calendar name is required' }

  const { data: calendar, error: calendarError } = await service
    .from('calendars')
    .insert({ name: name.trim(), description: description?.trim() || null, owner_id: user.id })
    .select()
    .single()

  if (calendarError) return { error: calendarError.message }

  const { error: memberError } = await service
    .from('calendar_members')
    .insert({ calendar_id: calendar.id, user_id: user.id })

  if (memberError) return { error: memberError.message }

  revalidatePath('/dashboard')
  return { success: true, calendarId: calendar.id }
}

export async function updateCalendar(calendarId: string, formData: FormData) {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify membership
  const { data: member } = await service
    .from('calendar_members')
    .select('id')
    .eq('calendar_id', calendarId)
    .eq('user_id', user.id)
    .single()
  if (!member) return { error: 'Not a member of this calendar' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  if (!name?.trim()) return { error: 'Calendar name is required' }

  const { error } = await service
    .from('calendars')
    .update({ name: name.trim(), description: description?.trim() || null })
    .eq('id', calendarId)

  if (error) return { error: error.message }

  revalidatePath(`/calendar/${calendarId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteCalendar(calendarId: string) {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Only owner can delete
  const { data: calendar } = await service
    .from('calendars')
    .select('owner_id')
    .eq('id', calendarId)
    .single()
  if (!calendar || calendar.owner_id !== user.id) return { error: 'Not authorized' }

  const { error } = await service.from('calendars').delete().eq('id', calendarId)
  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function leaveCalendar(calendarId: string) {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await service
    .from('calendar_members')
    .delete()
    .eq('calendar_id', calendarId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
