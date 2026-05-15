'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { acceptInvite } from '@/lib/actions/invites'
import { toast } from 'sonner'
import { CalendarDays } from 'lucide-react'

interface AcceptInviteButtonProps {
  token: string
  calendarId: string
}

export default function AcceptInviteButton({ token, calendarId }: AcceptInviteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptInvite(token)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Calendrier rejoint !')
        router.push(`/calendar/${calendarId}`)
      }
    })
  }

  return (
    <button
      onClick={handleAccept}
      disabled={isPending}
      className="w-full h-10 flex items-center justify-center gap-2 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50"
    >
      <CalendarDays className="w-4 h-4" />
      {isPending ? 'Connexion…' : 'Rejoindre le calendrier'}
    </button>
  )
}
