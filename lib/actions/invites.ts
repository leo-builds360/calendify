'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  // Reuse existing active invite if one exists
  const { data: existing } = await service
    .from('calendar_invites')
    .select('token')
    .eq('calendar_id', calendarId)
    .eq('created_by', user.id)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) return { success: true, token: existing.token }

  // Create a new invite valid for 1 year
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  const { data, error } = await service
    .from('calendar_invites')
    .insert({ calendar_id: calendarId, created_by: user.id, expires_at: expiresAt.toISOString() })
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

  // Do NOT mark as used — link stays reusable for everyone

  revalidatePath('/dashboard')
  revalidatePath(`/calendar/${invite.calendar_id}`)

  return { success: true, calendarId: invite.calendar_id }
}

export async function sendInviteEmail(calendarId: string, email: string) {
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

  // Get calendar name
  const { data: calendar } = await service
    .from('calendars')
    .select('name')
    .eq('id', calendarId)
    .single()
  if (!calendar) return { error: 'Calendar not found' }

  // Get or create invite token
  const inviteResult = await createInvite(calendarId)
  if (inviteResult?.error || !inviteResult?.token) {
    return { error: inviteResult?.error ?? 'Could not generate invite link' }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== 'http://localhost:3000'
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
  const inviteLink = `${appUrl}/invite/${inviteResult.token}`

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

  const { error } = await resend.emails.send({
    from: `Calendify <${fromEmail}>`,
    to: email,
    subject: `You're invited to join "${calendar.name}" on Calendify`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1d1d1f;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">You've been invited!</h1>
        <p style="font-size: 15px; color: #6e6e73; margin-bottom: 32px;">
          You've been invited to join the calendar <strong style="color: #1d1d1f;">${calendar.name}</strong> on Calendify.
        </p>
        <a href="${inviteLink}" style="display: inline-block; background: #0071e3; color: white; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 12px;">
          Accept invitation
        </a>
        <p style="font-size: 13px; color: #8e8e93; margin-top: 32px;">
          Or copy this link into your browser:<br/>
          <span style="color: #0071e3;">${inviteLink}</span>
        </p>
      </div>
    `,
  })

  if (error) {
    if (error.message.includes('rate') || error.message.includes('limit')) {
      return { error: 'Limite d\'envoi atteinte. Réessaie dans quelques minutes.' }
    }
    if (error.message.includes('domain') || error.message.includes('verified') || error.message.includes('testing')) {
      return { error: 'Domaine non vérifié sur Resend. Partage le lien directement en attendant.' }
    }
    return { error: error.message }
  }

  return { success: true }
}
