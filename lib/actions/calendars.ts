'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCalendar(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) return { error: 'Calendar name is required' }

  const { data: calendar, error: calendarError } = await supabase
    .from('calendars')
    .insert({ name: name.trim(), description: description?.trim() || null, owner_id: user.id })
    .select()
    .single()

  if (calendarError) return { error: calendarError.message }

  // Add creator as member
  const { error: memberError } = await supabase
    .from('calendar_members')
    .insert({ calendar_id: calendar.id, user_id: user.id })

  if (memberError) return { error: memberError.message }

  revalidatePath('/dashboard')
  return { success: true, calendarId: calendar.id }
}

export async function updateCalendar(
  calendarId: string,
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) return { error: 'Calendar name is required' }

  const { error } = await supabase
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('calendars')
    .delete()
    .eq('id', calendarId)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function leaveCalendar(calendarId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('calendar_members')
    .delete()
    .eq('calendar_id', calendarId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
