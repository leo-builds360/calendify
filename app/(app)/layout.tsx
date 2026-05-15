import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNavbar from '@/components/navbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <AppNavbar user={user} profile={profile} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
