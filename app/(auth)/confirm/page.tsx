import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  if (error) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-2">Échec de la confirmation</h2>
        <p className="text-[14px] text-[#6e6e73] mb-6">
          Ce lien de confirmation est invalide ou a expiré. Veuillez vous inscrire à nouveau.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center h-10 px-6 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors"
        >
          Retour à l&apos;inscription
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-2">Email confirmé !</h2>
      <p className="text-[14px] text-[#6e6e73] mb-6">
        Votre compte est prêt. Connectez-vous pour commencer.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-10 px-6 bg-[#0071e3] text-white text-[14px] font-medium rounded-xl hover:bg-[#0077ed] transition-colors"
      >
        Se connecter
      </Link>
    </div>
  )
}
