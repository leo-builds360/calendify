'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvite(calendarId: string) {
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

  // Invalidate previous unused invites from this user
  await service
    .from('calendar_invites')
    .update({ used: true })
    .eq('calendar_id', calendarId)
    .eq('created_by', user.id)
    .eq('used', false)

  const { data, error } = await service
    .from('calendar_invites')
    .insert({ calendar_id: calendarId, created_by: user.id })
    .select('token')
    .single()

  if (error) return { error: error.message }

  return { success: true, token: data.token }
}

export async function acceptInvite(token: string) {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?invite=${token}`)

  const { data: invite, error: inviteError } = await service
    .from('calendar_invites')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (inviteError || !invite) return { error: 'Invalid or expired invite link.' }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'This invite link has expired.' }
  }

  // Check if already a member
  const { data: existing } = await service
    .from('calendar_members')
    .select('id')
    .eq('calendar_id', invite.calendar_id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    const { error: memberError } = await service
      .from('calendar_members')
      .insert({ calendar_id: invite.calendar_id, user_id: user.id })

    if (memberError) return { error: memberError.message }
  }

  await service.from('calendar_invites').update({ used: true }).eq('id', invite.id)

  revalidatePath('/dashboard')
  revalidatePath(`/calendar/${invite.calendar_id}`)

  return { success: true, calendarId: invite.calendar_id }
}
