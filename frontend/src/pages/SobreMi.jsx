import { useEffect } from 'react'
import { Phone } from 'lucide-react'

export default function SobreMi() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <main>
      {/* Historia */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* Texto */}
          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl text-[#3d2314] leading-tight mb-8">
              Todo empieza pequeño...
            </h1>
            <div className="flex flex-col gap-5 text-sm md:text-base text-[#3d2314]/75 leading-relaxed">
              <p>
                Mi nombre es Jossira Santana, soy <span className="font-semibold text-[#3d2314]">#laquehaceloscariñitos</span>, madre de 3 chicos geniales, profesional en Mercadotecnia, soñadora y una persona llena de metas por cumplir.
              </p>
              <p>
                Este proyecto empezó con un regalito que hice para la beba de una querida amiga, y de ahí en adelante me fueron pidiendo otro igual, otros y otros... Siempre me han gustado las manualidades, pero hasta ese momento no había descubierto algo que realmente me apasionara tanto y que pudiera convertir en mi proyecto personal.
              </p>
              <p>
                Comparto esto para motivar a que empiecen a hacer las cosas que les apasionan sin importar lo poco que tengan — con las ganas y el amor que le pongan pueden arrancar perfectamente. Todo lo grande toma tiempo, esfuerzo y dedicación.
              </p>
              <p className="text-[#3d2314]/80">
                ¡Empieza hoy, empieza pequeño, con los pies en la tierra y la mirada en el cielo!
              </p>
              <p className="font-display text-2xl text-[#3d2314] mt-2">— Jossy 🍃🌺</p>
            </div>
          </div>

          {/* Foto Jossy */}
          <div className="flex-shrink-0 w-64 h-80 md:w-80 md:h-[480px] rounded-3xl overflow-hidden shadow-lg">
            <img
              src="/Jossy.jpeg"
              alt="Jossira Santana — Cariñitos by Jossy"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-[#fbddc3]/20 py-14">
        <div className="max-w-xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl text-[#3d2314]">Contáctame</h2>

          <a
            href="tel:+18296978429"
            className="flex items-center gap-2.5 text-[#3d2314] hover:text-[#5a3520] transition-colors"
          >
            <Phone size={18} className="text-[#3d2314]/60" />
            <span className="text-base font-medium">(829) 697-8429</span>
          </a>

          <a
            href="https://www.instagram.com/carinitosbyjossy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 group"
            aria-label="Instagram de Cariñitos by Jossy"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-[#3d2314]/70 group-hover:text-[#3d2314] transition-colors"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-sm text-[#3d2314]/60 group-hover:text-[#3d2314] transition-colors">
              @carinitosbyjossy
            </span>
          </a>
        </div>
      </section>
    </main>
  )
}
