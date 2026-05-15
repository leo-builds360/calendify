'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/actions/auth'
import { toast } from 'sonner'

export default function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const invite = searchParams.get('invite')
  const redirectTo = invite ? `/invite/${invite}` : '/dashboard'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <h1 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight mb-1">
        Bon retour
      </h1>
      <p className="text-[14px] text-[#6e6e73] mb-6">
        Connectez-vous à votre compte Calendify
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-3 py-2.5 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-[13px] text-[#6e6e73] mt-5">
        Pas encore de compte ?{' '}
        <Link
          href={invite ? `/signup?invite=${invite}` : '/signup'}
          className="text-[#0071e3] font-medium hover:underline"
        >
          S&apos;inscrire
        </Link>
      </p>
    </>
  )
}
