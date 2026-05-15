'use client'

import { useState, useTransition } from 'react'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { deleteCalendar } from '@/lib/actions/calendars'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteCalendarButtonProps {
  calendarId: string
  calendarName: string
}

export default function DeleteCalendarButton({ calendarId, calendarName }: DeleteCalendarButtonProps) {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCalendar(calendarId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Calendrier supprimé')
        router.push('/dashboard')
      }
    })
  }

  const isMatch = confirmed.trim().toLowerCase() === calendarName.trim().toLowerCase()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-xl text-[#8e8e93] hover:bg-red-50 hover:text-red-500 border border-gray-200 bg-white transition-colors"
        title="Supprimer le calendrier"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setOpen(false); setConfirmed('') }} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-fade-in">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-[18px] font-bold text-[#1d1d1f]">Supprimer le calendrier</h2>
              </div>
              <button
                onClick={() => { setOpen(false); setConfirmed('') }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
              <p className="text-[14px] text-red-700 font-semibold mb-1">
                Cette action est irréversible.
              </p>
              <p className="text-[13px] text-red-600">
                Le calendrier <strong>&quot;{calendarName}&quot;</strong>, tous ses événements et tous ses membres seront définitivement supprimés.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
                Pour confirmer, tapez le nom du calendrier :
              </label>
              <p className="text-[12px] text-[#6e6e73] font-mono bg-[#f5f5f7] px-3 py-1.5 rounded-lg mb-2 select-all">
                {calendarName}
              </p>
              <input
                type="text"
                value={confirmed}
                onChange={(e) => setConfirmed(e.target.value)}
                placeholder="Nom du calendrier…"
                autoFocus
                className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-white transition-all placeholder:text-[#c7c7cc]"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setOpen(false); setConfirmed('') }}
                className="flex-1 h-10 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-semibold rounded-xl hover:bg-[#e8e8ed] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={!isMatch || isPending}
                className="flex-1 h-10 bg-red-500 text-white text-[14px] font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
