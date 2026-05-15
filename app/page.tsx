import Link from 'next/link'
import { CalendarDays, Users, Heart, Shield, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0071e3] rounded-xl flex items-center justify-center">
              <CalendarDays className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-[#1d1d1f] tracking-tight">
              Calendify
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[15px] font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-colors px-3 py-2"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="text-[15px] font-bold bg-[#0071e3] text-white px-5 py-2.5 rounded-full hover:bg-[#0077ed] transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0071e3] text-[14px] font-bold px-4 py-1.5 rounded-full mb-8">
          <Heart className="w-3.5 h-3.5" />
          Pour la famille et les proches
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1d1d1f] leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
          Le calendrier partagé
          <br />
          <span className="text-[#0071e3]">de toute la famille</span>
        </h1>
        <p className="text-xl sm:text-2xl text-[#6e6e73] font-semibold max-w-2xl mx-auto leading-relaxed mb-10">
          Créez un calendrier commun avec vos proches, partagez vos événements et restez tous synchronisés — en deux clics.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#0077ed] transition-all hover:shadow-xl hover:shadow-blue-200"
          >
            Créer mon calendrier
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f5f5f7] text-[#1d1d1f] text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#e8e8ed] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Calendar preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80 border border-gray-100 bg-white">
          <div className="bg-[#f5f5f7] border-b border-gray-100 px-6 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 text-center">
              <span className="text-[13px] text-gray-400 font-semibold">calendify.app</span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-extrabold text-[#1d1d1f]">Mai 2025</span>
              <div className="flex gap-2">
                {['Mois', 'Semaine', 'Jour'].map((v) => (
                  <span
                    key={v}
                    className={`text-[13px] font-bold px-3 py-1.5 rounded-lg ${
                      v === 'Mois' ? 'bg-[#0071e3] text-white' : 'bg-[#f2f2f7] text-[#6e6e73]'
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                <div key={d} className="bg-white py-2.5 text-center text-[11px] font-extrabold text-[#8e8e93] uppercase tracking-wider">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2
                const isToday = day === 15
                const events: Record<number, { title: string; color: string }[]> = {
                  8:  [{ title: 'Repas chez mamie', color: 'bg-orange-500' }],
                  12: [{ title: 'Ciné avec Paul', color: 'bg-green-500' }],
                  15: [
                    { title: 'Anniversaire Léa', color: 'bg-pink-500' },
                    { title: 'Piscine enfants', color: 'bg-blue-500' },
                  ],
                  18: [{ title: 'Réunion parents', color: 'bg-purple-500' }],
                  22: [{ title: 'Barbecue famille', color: 'bg-orange-400' }],
                }
                return (
                  <div key={i} className={`bg-white min-h-[64px] sm:min-h-[80px] p-1.5 ${isToday ? 'bg-blue-50/50' : ''}`}>
                    {day > 0 && day <= 31 && (
                      <>
                        <div className={`text-[13px] w-7 h-7 flex items-center justify-center rounded-full mb-1 font-bold ${
                          isToday ? 'bg-[#0071e3] text-white' : 'text-[#1d1d1f]'
                        }`}>
                          {day}
                        </div>
                        {events[day]?.map((ev, idx) => (
                          <div key={idx} className={`${ev.color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-0.5 truncate`}>
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
      <section className="max-w-6xl mx-auto px-6 pb-20 sm:pb-28">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#1d1d1f] tracking-tight mb-4">
            Simple, pour tout le monde
          </h2>
          <p className="text-xl sm:text-2xl text-[#6e6e73] font-semibold">
            Pas besoin d&apos;être geek pour s&apos;en servir.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              icon: Users,
              title: 'Invitez vos proches',
              desc: 'Partagez un simple lien et vos proches rejoignent le calendrier en un clic, depuis leur téléphone ou leur ordinateur.',
            },
            {
              icon: CalendarDays,
              title: 'Tout le monde à jour',
              desc: 'Ajoutez un événement et toute la famille le voit instantanément. Fini les oublis et les malentendus.',
            },
            {
              icon: Shield,
              title: 'Privé et sécurisé',
              desc: 'Votre calendrier est privé. Seules les personnes que vous invitez peuvent le consulter.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#f5f5f7] rounded-3xl p-7 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#0071e3]/10 rounded-2xl flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-[#0071e3]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1d1d1f] mb-3">{title}</h3>
              <p className="text-[16px] font-semibold text-[#6e6e73] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1d1d1f] py-20 sm:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
            Prêt à vous organiser ensemble ?
          </h2>
          <p className="text-xl sm:text-2xl text-white/60 font-semibold mb-10">
            Totalement gratuit, pour toujours.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
            {['Calendrier partagé', 'Événements illimités', "Invitations par lien", 'Accessible sur mobile'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-[15px] font-bold text-white/80">
                <Check className="w-4 h-4 text-[#30d158]" />
                {f}
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-white text-[#1d1d1f] text-lg font-extrabold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Créer mon calendrier familial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#0071e3] rounded-lg flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold text-[#6e6e73]">Calendify</span>
          </div>
          <p className="text-[13px] font-semibold text-[#8e8e93]">
            © {new Date().getFullYear()} Calendify. Fait avec ❤️ pour les familles.
          </p>
        </div>
      </footer>
    </div>
  )
}
