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

  if (inviteError || !invite) return { error: 'Lien d\'invitation invalide ou expiré.' }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'Ce lien d\'invitation a expiré.' }
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
  if (!member) return { error: 'Non autorisé' }

  // Get calendar name
  const { data: calendar } = await service
    .from('calendars')
    .select('name')
    .eq('id', calendarId)
    .single()
  if (!calendar) return { error: 'Calendrier introuvable' }

  // Get or create invite token
  const inviteResult = await createInvite(calendarId)
  if (inviteResult?.error || !inviteResult?.token) {
    return { error: inviteResult?.error ?? 'Impossible de générer le lien' }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== 'http://localhost:3000'
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

  const inviteLink = `${appUrl}/invite/${inviteResult.token}`

  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@calendify.app'
  const senderName = process.env.BREVO_SENDER_NAME ?? 'Calendify'

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject: `Vous êtes invité(e) à rejoindre "${calendar.name}" sur Calendify`,
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1d1d1f;">
          <div style="text-align:center; margin-bottom: 32px;">
            <div style="display:inline-flex; align-items:center; gap:8px;">
              <div style="width:36px; height:36px; background:#0071e3; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                <span style="color:white; font-size:18px;">📅</span>
              </div>
              <span style="font-size:20px; font-weight:800; color:#1d1d1f;">Calendify</span>
            </div>
          </div>
          <h1 style="font-size:26px; font-weight:800; margin-bottom:12px; text-align:center;">Vous êtes invité(e) !</h1>
          <p style="font-size:16px; color:#6e6e73; margin-bottom:8px; text-align:center;">
            Vous avez été invité(e) à rejoindre le calendrier partagé
          </p>
          <p style="font-size:20px; font-weight:700; color:#1d1d1f; margin-bottom:32px; text-align:center;">
            ${calendar.name}
          </p>
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${inviteLink}" style="display:inline-block; background:#0071e3; color:white; font-size:16px; font-weight:700; text-decoration:none; padding:16px 32px; border-radius:14px;">
              Rejoindre le calendrier
            </a>
          </div>
          <p style="font-size:13px; color:#8e8e93; text-align:center;">
            Ou copiez ce lien dans votre navigateur :<br/>
            <a href="${inviteLink}" style="color:#0071e3;">${inviteLink}</a>
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg: string = (err as { message?: string }).message ?? 'Erreur lors de l\'envoi'
    if (msg.includes('sender') || msg.includes('authorized') || msg.includes('verified')) {
      return { error: 'Adresse expéditeur non vérifiée sur Brevo. Vérifie ton adresse dans les paramètres Brevo.' }
    }
    return { error: msg }
  }

  return { success: true }
}
