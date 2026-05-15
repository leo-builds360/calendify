'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signUp } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export default function SignupForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const searchParams = useSearchParams()
  const invite = searchParams.get('invite')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        setDone(true)
      }
    })
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-2">Vérifiez votre email</h2>
        <p className="text-[14px] text-[#6e6e73] leading-relaxed">
          Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez dessus pour activer votre compte.
        </p>
        {invite && (
          <p className="text-[13px] text-[#8e8e93] mt-3">
            Après confirmation, vous rejoindrez automatiquement votre calendrier partagé.
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <h1 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight mb-1">
        Créer un compte
      </h1>
      <p className="text-[14px] text-[#6e6e73] mb-6">
        {invite ? "Inscrivez-vous pour accepter l'invitation" : 'Commencez avec Calendify gratuitement'}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-3 py-2.5 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {invite && <input type="hidden" name="invite" value={invite} />}

        <div>
          <label htmlFor="full_name" className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
            Nom complet
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Marie Dupont"
            className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
          />
        </div>
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
            minLength={8}
            autoComplete="new-password"
            placeholder="Min. 8 caractères"
            className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full h-10 px-3.5 text-[14px] bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all placeholder:text-[#8e8e93]"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? 'Création du compte…' : 'Créer un compte'}
        </button>
      </form>

      <p className="text-center text-[13px] text-[#6e6e73] mt-5">
        Déjà un compte ?{' '}
        <Link
          href={invite ? `/login?invite=${invite}` : '/login'}
          className="text-[#0071e3] font-medium hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </>
  )
}
