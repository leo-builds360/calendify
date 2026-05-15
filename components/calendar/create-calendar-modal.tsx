'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { createCalendar } from '@/lib/actions/calendars'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateCalendarModalProps {
  variant?: 'default' | 'empty'
}

export default function CreateCalendarModal({ variant = 'default' }: CreateCalendarModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createCalendar(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Calendrier créé !')
        setOpen(false)
        if (result?.calendarId) {
          router.push(`/calendar/${result.calendarId}`)
        }
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          variant === 'empty'
            ? 'inline-flex items-center gap-2 h-10 px-5 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors'
            : 'inline-flex items-center gap-1.5 h-9 px-4 bg-[#0071e3] text-white text-[13px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors'
        }
      >
        <Plus className={variant === 'empty' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        Nouveau calendrier
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-bold text-[#1d1d1f]">Nouveau calendrier</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                  Nom du calendrier <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  autoFocus
                  placeholder="ex. Famille, Équipe Q2, Voyage"
                  className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                  Description
                  <span className="text-[#8e8e93] font-normal ml-1">(optionnel)</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="À quoi sert ce calendrier ?"
                  className="w-full px-3.5 py-2.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all resize-none placeholder:text-[#8e8e93]"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-10 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium rounded-xl hover:bg-[#e8e8ed] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Création…' : 'Créer le calendrier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
