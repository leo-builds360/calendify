'use client'

import { useState, useTransition, useEffect } from 'react'
import { UserPlus, X, Copy, Check, Link2, Mail, Send } from 'lucide-react'
import { createInvite, sendInviteEmail } from '@/lib/actions/invites'
import { toast } from 'sonner'

interface InviteModalProps {
  calendarId: string
  calendarName: string
}

export default function InviteModal({ calendarId, calendarName }: InviteModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSending, startSending] = useTransition()
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')

  // Auto-generate link when modal opens
  useEffect(() => {
    if (!open) return
    startTransition(async () => {
      const result = await createInvite(calendarId)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.token) {
        setInviteLink(`${window.location.origin}/invite/${result.token}`)
      }
    })
  }, [open, calendarId])

  const handleCopy = async () => {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = () => {
    if (!email.trim()) return
    startSending(async () => {
      const result = await sendInviteEmail(calendarId, email.trim())
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`Invitation envoyée à ${email}`)
        setEmail('')
      }
    })
  }

  const handleClose = () => {
    setOpen(false)
    setInviteLink(null)
    setCopied(false)
    setEmail('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-4 bg-white border border-gray-200 text-[#1d1d1f] text-[13px] font-medium rounded-xl hover:border-[#0071e3]/50 hover:text-[#0071e3] transition-colors"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Inviter
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-bold text-[#1d1d1f]">Inviter des personnes</h2>
                <p className="text-[13px] text-[#6e6e73]">{calendarName}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email invitation */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#0071e3]" />
                <span className="text-[14px] font-medium text-[#1d1d1f]">Inviter par email</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                  placeholder="adresse@email.com"
                  className="flex-1 h-10 px-3 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]"
                />
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || !email.trim()}
                  className="h-10 px-4 flex items-center gap-1.5 bg-[#0071e3] text-white text-[13px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSending ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[12px] text-[#8e8e93]">ou partager le lien</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Invite link */}
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-[#0071e3]" />
                <span className="text-[14px] font-medium text-[#1d1d1f]">Lien d&apos;invitation</span>
              </div>

              {isPending ? (
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
              ) : inviteLink ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
                    <p className="flex-1 text-[12px] text-[#6e6e73] font-mono truncate">
                      {inviteLink}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full h-10 flex items-center justify-center gap-2 bg-[#1d1d1f] text-white text-[13px] font-medium rounded-xl hover:bg-black transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copier le lien
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>

            <p className="text-[12px] text-[#8e8e93] text-center mt-4">
              Ce lien est réutilisable — plusieurs personnes peuvent l&apos;utiliser.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
