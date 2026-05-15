'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const invite = formData.get('invite') as string | null

  const callbackUrl = invite
    ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?invite=${invite}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: callbackUrl,
    },
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  redirect(redirectTo)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
