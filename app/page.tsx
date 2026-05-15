import Link from 'next/link'
import { CalendarDays, Users, Heart, Shield, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0071e3] rounded-lg flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">
              Calendify
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="text-[14px] font-medium bg-[#0071e3] text-white px-4 py-1.5 rounded-full hover:bg-[#0077ed] transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0071e3] text-[13px] font-medium px-3 py-1 rounded-full mb-6">
          <Heart className="w-3 h-3" />
          Pour la famille et les proches
        </div>
        <h1 className="text-[56px] font-bold text-[#1d1d1f] leading-[1.07] tracking-tight mb-6 max-w-3xl mx-auto">
          Le calendrier partagé
          <br />
          <span className="text-[#0071e3]">de toute la famille</span>
        </h1>
        <p className="text-[19px] text-[#6e6e73] max-w-xl mx-auto leading-relaxed mb-10">
          Créez un calendrier commun avec vos proches, partagez vos événements et restez tous synchronisés — en deux clics.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#0071e3] text-white text-[15px] font-medium px-7 py-3 rounded-full hover:bg-[#0077ed] transition-all hover:shadow-lg hover:shadow-blue-200"
          >
            Créer mon calendrier
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-medium px-7 py-3 rounded-full hover:bg-[#e8e8ed] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Calendar preview */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80 border border-gray-100 bg-white">
          <div className="bg-[#f5f5f7] border-b border-gray-100 px-6 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 text-center">
              <span className="text-[12px] text-gray-400 font-medium">calendify.app/calendar</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#1d1d1f]">Mai 2025</span>
              <div className="flex gap-2">
                {['Mois', 'Semaine', 'Jour'].map((v) => (
                  <span
                    key={v}
                    className={`text-[12px] font-medium px-3 py-1 rounded-md ${
                      v === 'Mois'
                        ? 'bg-[#0071e3] text-white'
                        : 'bg-[#f2f2f7] text-[#6e6e73]'
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                <div key={d} className="bg-white py-2 text-center text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2
                const isToday = day === 15
                const events: Record<number, { title: string; color: string }[]> = {
                  8: [{ title: 'Repas chez mamie', color: 'bg-orange-500' }],
                  12: [{ title: 'Ciné avec Paul', color: 'bg-green-500' }],
                  15: [
                    { title: 'Anniversaire Léa', color: 'bg-pink-500' },
                    { title: 'Piscine enfants', color: 'bg-blue-500' },
                  ],
                  18: [{ title: 'Réunion parents', color: 'bg-purple-500' }],
                  22: [{ title: 'Barbecue famille', color: 'bg-orange-400' }],
                }
                return (
                  <div
                    key={i}
                    className={`bg-white min-h-[72px] p-1.5 ${isToday ? 'bg-blue-50/40' : ''}`}
                  >
                    {day > 0 && day <= 31 && (
                      <>
                        <div
                          className={`text-[12px] w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                            isToday
                              ? 'bg-[#0071e3] text-white font-semibold'
                              : 'text-[#1d1d1f]'
                          }`}
                        >
                          {day}
                        </div>
                        {events[day]?.map((ev, idx) => (
                          <div
                            key={idx}
                            className={`${ev.color} text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm mb-0.5 truncate`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-[36px] font-bold text-[#1d1d1f] tracking-tight mb-3">
            Simple, pour tout le monde
          </h2>
          <p className="text-[17px] text-[#6e6e73]">
            Pas besoin d&apos;être geek pour s&apos;en servir.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Invitez vos proches',
              desc: 'Partagez un simple lien et vos proches rejoignent le calendrier en un clic, depuis leur téléphone ou leur ordinateur.',
            },
            {
              icon: CalendarDays,
              title: 'Tout le monde est à jour',
              desc: 'Ajoutez un événement et toute la famille le voit instantanément. Fini les oublis et les malentendus.',
            },
            {
              icon: Shield,
              title: 'Privé et sécurisé',
              desc: 'Votre calendrier est privé. Seules les personnes que vous invitez peuvent le consulter.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#f5f5f7] rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#0071e3]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{title}</h3>
              <p className="text-[14px] text-[#6e6e73] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1d1d1f] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-[36px] font-bold text-white tracking-tight mb-4">
            Prêt à vous organiser ensemble ?
          </h2>
          <p className="text-[17px] text-white/60 mb-8">
            Totalement gratuit, pour toujours.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Calendrier partagé', 'Événements illimités', 'Invitations par lien', 'Accessible sur mobile'].map(
              (f) => (
                <div key={f} className="flex items-center gap-1.5 text-[13px] text-white/70">
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                  {f}
                </div>
              )
            )}
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#1d1d1f] text-[15px] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Créer mon calendrier familial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#0071e3] rounded-md flex items-center justify-center">
              <CalendarDays className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#6e6e73]">Calendify</span>
          </div>
          <p className="text-[12px] text-[#8e8e93]">
            © {new Date().getFullYear()} Calendify. Fait avec ❤️ pour les familles.
          </p>
        </div>
      </footer>
    </div>
  )
}
