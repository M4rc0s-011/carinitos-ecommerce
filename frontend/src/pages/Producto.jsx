import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Ruler, Layers, Clock, Truck, Link2, ArrowLeft, Loader2 } from 'lucide-react'
import { getProducto } from '../api/productos'
import { useCarrito } from '../context/CarritoContext'

const MAX_MENSAJE = 200

function Placeholder({ className = '' }) {
  return (
    <div className={`bg-[#fbddc3] flex items-center justify-center ${className}`}>
      <span className="font-display text-[#3d2314]/30 text-xl">Cariñitos</span>
    </div>
  )
}

export default function Producto() {
  const { id } = useParams()
  const { agregarItem } = useCarrito()

  const [producto,        setProducto]        = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)
  const [cantidad,        setCantidad]        = useState(1)
  const [mensaje,         setMensaje]         = useState('')
  const [personalizacion, setPersonalizacion] = useState('')
  const [copiado,         setCopiado]         = useState(false)
  const [agregado,        setAgregado]        = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProducto(id)
      .then(setProducto)
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 flex justify-center">
        <Loader2 size={32} className="animate-spin text-[#3d2314]/40" />
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-[#3d2314]/60 mb-6">{error ?? 'Producto no encontrado.'}</p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-[#3d2314] underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const { nombre, precio, descripcion, detalles } = producto

  const detalleItems = detalles
    ? [
        { icon: Ruler,  label: 'Tamaño',     valor: detalles.tamaño },
        { icon: Layers, label: 'Material',   valor: detalles.material },
        { icon: Clock,  label: 'Producción', valor: detalles.tiempoProduccion },
        { icon: Truck,  label: 'Envíos',     valor: detalles.envios },
      ]
    : []

  function handleCopiar() {
    navigator.clipboard.writeText(window.location.href)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Mira este producto de Cariñitos by Jossy! ${window.location.href}`)}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#3d2314]/60 hover:text-[#3d2314] transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Volver
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Columna izquierda — imagen */}
        <div className="flex flex-col gap-3">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={nombre}
              className="w-full aspect-square rounded-2xl object-cover"
            />
          ) : (
            <Placeholder className="w-full aspect-square rounded-2xl" />
          )}
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-[#3d2314] leading-tight mb-1">
              {nombre}
            </h1>
            <p className="text-2xl font-semibold text-[#3d2314]">
              RD$ {Number(precio).toLocaleString()}
            </p>
          </div>

          {descripcion && (
            <p className="text-sm text-[#3d2314]/70 leading-relaxed">{descripcion}</p>
          )}

          {detalleItems.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {detalleItems.map(({ icon: Icon, label, valor }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <Icon size={15} className="text-[#3d2314]/50 flex-shrink-0" />
                  <span className="text-[#3d2314]/50 w-24">{label}</span>
                  <span className="text-[#3d2314] font-medium">{valor}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="h-px bg-[#fbddc3]" />

          {/* Mensaje en colgante */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3d2314]">
              ¿Qué mensaje deseas en tu colgante? <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value.slice(0, MAX_MENSAJE))}
              placeholder="Ej: Dios bendiga este hogar"
              className="w-full border border-[#fbddc3] rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
            />
            <span className="text-xs text-[#3d2314]/40 text-right">
              {mensaje.length}/{MAX_MENSAJE}
            </span>
          </div>

          {/* Personalización libre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3d2314]">
              Añade tu personalización <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value.slice(0, MAX_MENSAJE))}
              placeholder="Ej: base rosada, letras doradas, madera rústica..."
              className="w-full border border-[#fbddc3] rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors resize-none"
            />
            <span className="text-xs text-[#3d2314]/40 text-right">
              {personalizacion.length}/{MAX_MENSAJE}
            </span>
          </div>

          <p className="text-xs text-[#3d2314]/50 italic">
            Los campos marcados con <span className="text-red-400">*</span> son obligatorios para agregar al carrito.
            El precio final puede variar según la personalización solicitada.
          </p>

          {/* Cantidad */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#3d2314]">Cantidad</span>
            <div className="flex items-center border border-[#fbddc3] rounded-full overflow-hidden">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-4 py-2 text-[#3d2314] hover:bg-[#fbddc3]/40 transition-colors text-lg leading-none"
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="px-4 text-sm font-medium text-[#3d2314] min-w-[2rem] text-center">
                {cantidad}
              </span>
              <button
                onClick={() => setCantidad((c) => Math.min(10, c + 1))}
                className="px-4 py-2 text-[#3d2314] hover:bg-[#fbddc3]/40 transition-colors text-lg leading-none"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {(!mensaje.trim() || !personalizacion.trim()) && !agregado && (
            <p className="text-xs text-[#3d2314]/50 italic">
              Completa el mensaje y la personalización para continuar.
            </p>
          )}

          <div className="flex gap-2 overflow-hidden">
            <button
              onClick={() => {
                agregarItem(producto, cantidad, mensaje, personalizacion)
                setAgregado(true)
              }}
              disabled={!mensaje.trim() || !personalizacion.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3d2314] text-[#fbddc3] px-6 py-3.5 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              Añadir al carrito
            </button>
            <Link
              to="/carrito"
              className={`flex items-center justify-center gap-2 bg-[#edbce0] text-[#3d2314] py-3.5 rounded-full text-sm font-medium hover:bg-[#e5aad6] transition-all duration-300 overflow-hidden whitespace-nowrap ${
                agregado ? 'flex-1 opacity-100 px-6' : 'w-0 opacity-0 px-0'
              }`}
            >
              <ShoppingBag size={16} />
              Ver carrito
            </Link>
          </div>

          {/* Compartir */}
          <div className="flex gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#1ebe5d] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Compartir
            </a>
            <button
              onClick={handleCopiar}
              className="flex-1 flex items-center justify-center gap-2 bg-[#fbddc3] text-[#3d2314] py-2.5 rounded-full text-sm font-medium hover:bg-[#f5cead] transition-colors"
            >
              <Link2 size={15} />
              {copiado ? '¡Copiado!' : 'Copiar enlace'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
