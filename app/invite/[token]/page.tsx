import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Clock, UserPlus, AlertCircle } from 'lucide-react'
import AcceptInviteButton from '@/components/invites/accept-invite-button'
import { formatDistanceToNow } from 'date-fns'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Use SECURITY DEFINER function so anon/service can read invite
  const service = createServiceClient()
  const { data: invites, error } = await service.rpc('get_invite_by_token', {
    p_token: token,
  })

  const invite = invites?.[0]

  if (error || !invite) {
    return <InviteError message="This invite link is invalid or has expired." token={token} />
  }

  if (invite.used) {
    return <InviteError message="This invite link has already been used." token={token} />
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <InviteError message="This invite link has expired." token={token} />
  }

  // Check if user is logged in
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-[#0071e3]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CalendarDays className="w-7 h-7 text-[#0071e3]" />
        </div>

        <h1 className="text-[20px] font-bold text-[#1d1d1f] mb-2">
          You&apos;re invited!
        </h1>
        <p className="text-[14px] text-[#6e6e73] mb-1">
          Join the shared calendar
        </p>
        <p className="text-[18px] font-semibold text-[#1d1d1f] mb-5">
          {invite.calendar_name}
        </p>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#8e8e93] mb-6">
          <Clock className="w-3.5 h-3.5" />
          Expires {formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })}
        </div>

        {user ? (
          <AcceptInviteButton token={token} calendarId={invite.calendar_id} />
        ) : (
          <div className="space-y-3">
            <Link
              href={`/signup?invite=${token}`}
              className="flex items-center justify-center gap-2 w-full h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Create account &amp; join
            </Link>
            <Link
              href={`/login?invite=${token}`}
              className="flex items-center justify-center gap-2 w-full h-10 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium rounded-xl hover:bg-[#e8e8ed] transition-colors"
            >
              Sign in to join
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function InviteError({ message, token }: { message: string; token: string }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-2">Invalid invite</h2>
        <p className="text-[14px] text-[#6e6e73] mb-6">{message}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-10 px-6 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
