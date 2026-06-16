import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Package } from 'lucide-react'
import { getProductos } from '../api/productos'
import ProductCard from '../components/ProductCard'

const VALORES = [
  {
    icon: Heart,
    titulo: 'Hecho a mano',
    subtitulo: 'Cada pieza es única y elaborada con dedicación',
  },
  {
    icon: Sparkles,
    titulo: 'Personalizable',
    subtitulo: 'Nombre, combinacion de colores, mensajes y más.',
  },
  {
    icon: Package,
    titulo: 'Envíos a todo el país',
    subtitulo: 'Rápido, seguro y con mucho cariño.',
  },
]

function mezclar(arr) {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export default function Home() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    getProductos({ ordenar: 'recientes' })
      .then((data) => setProductos(mezclar(data)))
      .catch(() => { })
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[70vh] bg-[url('/hero1.jpeg')] bg-cover bg-[center_30%] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center gap-6 mt-70">
          <h1 className="font-display text-5xl md:text-8xl text-white leading-7 drop-shadow-md whitespace-nowrap">
            Detalles hechos con amor
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-md">
            Colgantes artesanales personalizados que cuentan tu historia, diseñados con cariño y dedicación.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-white text-[#3d2314] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#fbddc3] transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-[#fbddc3]/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALORES.map(({ icon: Icon, titulo, subtitulo }) => (
              <div key={titulo} className="text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#fbddc3] flex items-center justify-center">
                  <Icon size={20} className="text-[#3d2314]" />
                </div>
                <h3 className="font-semibold text-[#3d2314]">{titulo}</h3>
                <p className="text-sm text-[#3d2314]/70">{subtitulo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-5">
        <h2 className="font-display text-3xl md:text-6xl text-[#3d2314] text-center mb-10">
          Algunos de nuestros productos
        </h2>
        {productos.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex w-max gap-6 animate-marquee">
              {[...productos, ...productos].map((p, i) => (
                <div key={`${p.id}-${i}`} className="w-56 sm:w-64 flex-shrink-0">
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/catalogo"
            className="inline-block border border-[#3d2314] text-[#3d2314] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#3d2314] hover:text-[#fbddc3] transition-colors"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </section>

      {/* CTA Personalización */}
      <section className="bg-[#edbce0] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-[#3d2314] mb-4">
            Personaliza tu diseño
          </h2>
          <p className="text-[#3d2314]/70 mb-8">
            Elige tu mensaje, combinación de colores y mucho más para crear una pieza única.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-[#3d2314] text-[#fbddc3] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors"
          >
            Personaliza tu colgante
          </Link>
        </div>
      </section>
    </main>
  )
}
