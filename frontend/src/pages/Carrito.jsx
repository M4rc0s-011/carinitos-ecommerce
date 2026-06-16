import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, CheckCircle, Copy, ShoppingBag, Loader2 } from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import { optimizarImagen } from '../utils/cloudinary'
import { crearPedido } from '../api/pedidos'

const COSTO_ENVIO = { santo_domingo: 250, interior: 300 }

const CUENTAS = [
  { banco: 'Cédula', numero: '026-0075287-3', titular: 'JOSSIRA IVELISSE SANTANA GUANTE', logo: '/bancos/cedula.png' },
  { banco: 'Cédula', numero: '402-3184650-8', titular: 'MARCOS XAVIER RODRIGUEZ SANTANA', logo: '/bancos/cedula.png' },
  { banco: 'Banco Popular (corriente)', numero: '847069721', titular: 'Marcos Rodríguez', logo: '/bancos/popular.jpg' },
  { banco: 'Banreservas (Ahorro)', numero: '6700075080', titular: 'Jossira Santana', logo: '/bancos/banreservas.png' },
  { banco: 'BHD (Ahorro)', numero: '30102240014', titular: 'Marcos Rodriguez', logo: '/bancos/bhd.jpg' },
]

const INFO_ENVIO = [
  'Realizar el avance del 50%',
  'Indicarnos los detalles para tu colgante',
  'Entrega de 3 a 5 días',
  'Delivery en Santo Domingo (RD$250)',
  'Envíos al interior por Vimenpaq y BMcargo (RD$250)',
]

export default function Carrito() {
  const { items, eliminarItem, actualizarCantidad, vaciarCarrito, totalPrecio } = useCarrito()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [tipoEnvio, setTipoEnvio] = useState('santo_domingo')
  const [copiados, setCopiados] = useState({})
  const [modal, setModal] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorPedido, setErrorPedido] = useState(null)

  const costoEnvio = COSTO_ENVIO[tipoEnvio]
  const total = totalPrecio + costoEnvio
  const adelanto = Math.ceil(total / 2)

  function handleCopiarCuenta(numero) {
    navigator.clipboard.writeText(numero)
    setCopiados((prev) => ({ ...prev, [numero]: true }))
    setTimeout(() => setCopiados((prev) => ({ ...prev, [numero]: false })), 1500)
  }

  async function handleConfirmar() {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', {
        state: { mensaje: 'Debes iniciar sesión para confirmar tu pedido', from: '/carrito' },
      })
      return
    }

    setEnviando(true)
    setErrorPedido(null)
    try {
      const payload = {
        items: items.map((item) => ({
          producto_id: item.producto_id ?? item.id,
          cantidad: item.cantidad,
          mensaje: item.mensaje,
          personalizacion: item.personalizacion,
        })),
        tipo_envio: tipoEnvio,
      }
      await crearPedido(payload)
    } catch {
      setErrorPedido('No se pudo registrar tu pedido. Intenta de nuevo.')
      setEnviando(false)
      return
    }
    setEnviando(false)

    const listaProductos = items
      .map((item) => {
        let linea = `• ${item.nombre} x${item.cantidad} — RD$${(item.precio * item.cantidad).toLocaleString()}`
        if (item.mensaje) linea += `\n  Mensaje: ${item.mensaje}`
        if (item.personalizacion) linea += `\n  Personalización: ${item.personalizacion}`
        return linea
      })
      .join('\n')

    const tipoEnvioTexto =
      tipoEnvio === 'santo_domingo'
        ? 'Delivery Santo Domingo'
        : 'Envío al interior (Vimenpaq / BMcargo)'

    const mensaje = `Hola! Quiero realizar un pedido de Cariñitos by Jossy

*Productos:*
${listaProductos}

*Tipo de envío:* ${tipoEnvioTexto} (+RD$${costoEnvio})

*Total:* RD$${total.toLocaleString()}
*Adelanto (50%):* RD$${adelanto.toLocaleString()}

Adjunto comprobante de pago`

    setWhatsappUrl(`https://wa.me/18296978429?text=${encodeURIComponent(mensaje)}`)
    setModal(true)
  }

  function handleAbrirWhatsApp() {
    setModal(false)
    vaciarCarrito()
    window.open(whatsappUrl)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="text-[#fbddc3] mx-auto mb-4" />
        <p className="text-[#3d2314]/60 mb-6">Tu carrito está vacío.</p>
        <Link
          to="/catalogo"
          className="inline-block bg-[#3d2314] text-[#fbddc3] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl text-[#3d2314] mb-3">¡Casi listo! 🌸</h2>
              <p className="text-sm text-[#3d2314]/70 mb-3">Para confirmar tu pedido, necesitas:</p>
              <ol className="flex flex-col gap-3">
                <li className="flex items-start gap-3 text-sm text-[#3d2314]/80">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fbddc3] flex items-center justify-center text-xs font-semibold text-[#3d2314]">1</span>
                  {`Realizar una transferencia del 50% de adelanto (RD$${adelanto.toLocaleString()}) a cualquiera de nuestras cuentas`}
                </li>
                <li className="flex items-start gap-3 text-sm text-[#3d2314]/80">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#fbddc3] flex items-center justify-center text-xs font-semibold text-[#3d2314]">2</span>
                  Adjuntar el comprobante de pago en el chat de WhatsApp que se abrirá a continuación
                </li>
              </ol>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAbrirWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1ebe5d] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Entendido, abrir WhatsApp
              </button>
              <button
                onClick={() => setModal(false)}
                className="w-full py-3 rounded-full text-sm font-medium text-[#3d2314]/60 hover:text-[#3d2314] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="font-display text-3xl md:text-4xl text-[#3d2314] mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* Columna izquierda — items */}
        <div className="flex flex-col gap-6">
          {items.map((item, idx) => (
            <div key={idx}>
              <div className="flex gap-4">
                <Link to={`/producto/${item.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-[#fbddc3] overflow-hidden flex items-center justify-center">
                    {item.imagen ? (
                      <img src={optimizarImagen(item.imagen, { w: 160, h: 160 })} alt={item.nombre} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-[#3d2314]/30 text-xs">Cariñitos</span>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/producto/${item.id}`}>
                      <h3 className="font-medium text-[#3d2314] text-sm hover:underline">{item.nombre}</h3>
                    </Link>
                    <button
                      onClick={() => eliminarItem(idx)}
                      className="text-[#3d2314]/30 hover:text-red-400 transition-colors flex-shrink-0"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {item.mensaje && (
                    <p className="text-xs text-[#3d2314]/60 mt-0.5">Mensaje: {item.mensaje}</p>
                  )}
                  {item.personalizacion && (
                    <p className="text-xs text-[#3d2314]/60">Personalización: {item.personalizacion}</p>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center border border-[#fbddc3] rounded-full overflow-hidden">
                      <button
                        onClick={() => actualizarCantidad(idx, item.cantidad - 1)}
                        className="px-3 py-1 text-[#3d2314] hover:bg-[#fbddc3]/40 transition-colors text-base leading-none"
                        aria-label="Reducir"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm font-medium text-[#3d2314] min-w-[2rem] text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(idx, item.cantidad + 1)}
                        className="px-3 py-1 text-[#3d2314] hover:bg-[#fbddc3]/40 transition-colors text-base leading-none"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#3d2314]/50">
                        RD${item.precio.toLocaleString()} × {item.cantidad}
                      </span>
                      <p className="text-sm font-semibold text-[#3d2314]">
                        RD${(item.precio * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {idx < items.length - 1 && <hr className="mt-6 border-[#fbddc3]" />}
            </div>
          ))}

          {/* Totales */}
          <div className="border-t border-[#fbddc3] pt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-[#3d2314]/70">
              <span>Subtotal productos</span>
              <span>RD${totalPrecio.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#3d2314]/70">
              <span>Envío</span>
              <span>RD${costoEnvio}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#3d2314] text-base border-t border-[#fbddc3] pt-2 mt-1">
              <span>Total</span>
              <span>RD${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Columna derecha — checkout */}
        <div className="flex flex-col gap-6">
          {/* Detalles para ordenar */}
          <div className="bg-[#fbddc3]/20 rounded-2xl p-5">
            <h2 className="font-semibold text-[#3d2314] mb-3 text-2xl">Detalles para ordenar</h2>
            <ul className="flex flex-col gap-2">
              {INFO_ENVIO.map((texto) => (
                <li key={texto} className="flex items-start gap-2 text-sm text-[#3d2314]/80">
                  <CheckCircle size={14} className="text-[#3d2314]/50 mt-0.5 flex-shrink-0" />
                  {texto}
                </li>
              ))}
            </ul>
          </div>

          {/* Selector tipo de envío */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-[#3d2314] text-sm">Tipo de envío</h2>
            {[
              { value: 'santo_domingo', label: 'Delivery Santo Domingo' },
              { value: 'interior', label: 'Envío al interior' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTipoEnvio(value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-colors ${tipoEnvio === value
                  ? 'border-[#3d2314] bg-[#fbddc3]/30 text-[#3d2314] font-medium'
                  : 'border-[#fbddc3] text-[#3d2314]/70'
                  }`}
              >
                <span>{label}</span>
                <span className="text-xs">+RD${COSTO_ENVIO[value]}</span>
              </button>
            ))}
          </div>

          {/* Nuestras cuentas */}
          <div className="bg-[#fbddc3]/20 rounded-2xl p-5">
            <h2 className="font-semibold text-[#3d2314] mb-3 text-2xl">Nuestras cuentas</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {/* Cédulas */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-[#3d2314]/40 uppercase tracking-wide">Cédula</p>
                {CUENTAS.filter((c) => c.banco === 'Cédula').map((cuenta) => (
                  <div key={cuenta.numero} className="flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-xs text-[#3d2314]/50 truncate">{cuenta.titular}</p>
                      <p className="text-sm font-medium text-[#3d2314]">{cuenta.numero}</p>
                    </div>
                    <button
                      onClick={() => handleCopiarCuenta(cuenta.numero)}
                      className="flex-shrink-0 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                      aria-label="Copiar número"
                    >
                      {copiados[cuenta.numero] ? (
                        <span className="text-xs text-green-600 font-medium">¡Copiado!</span>
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Bancos */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-[#3d2314]/40 uppercase tracking-wide">Bancos</p>
                {CUENTAS.filter((c) => c.banco !== 'Cédula').map((cuenta) => (
                  <div key={cuenta.numero} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={cuenta.logo} alt={cuenta.banco} className="w-7 h-7 object-contain flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-[#3d2314]/50 truncate">{cuenta.banco}</p>
                        <p className="text-sm font-medium text-[#3d2314]">{cuenta.numero}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopiarCuenta(cuenta.numero)}
                      className="flex-shrink-0 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                      aria-label="Copiar número"
                    >
                      {copiados[cuenta.numero] ? (
                        <span className="text-xs text-green-600 font-medium">¡Copiado!</span>
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirmar pedido */}
          {errorPedido && (
            <p className="text-sm text-red-500 text-center">{errorPedido}</p>
          )}
          <button
            onClick={handleConfirmar}
            disabled={enviando}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-full text-sm font-medium hover:bg-[#1ebe5d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enviando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
            {enviando ? 'Registrando pedido...' : 'Confirmar pedido por WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  )
}
