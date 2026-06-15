import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown, ChevronUp, Loader2, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMisPedidos, getPedido } from '../api/pedidos'

const BADGE = {
  pendiente:   'bg-yellow-100 text-yellow-800',
  en_proceso:  'bg-blue-100 text-blue-800',
  completado:  'bg-green-100 text-green-800',
  cancelado:   'bg-red-100 text-red-800',
}

const LABEL_ESTADO = {
  pendiente:   'Pendiente',
  en_proceso:  'En proceso',
  completado:  'Completado',
  cancelado:   'Cancelado',
}

const LABEL_ENVIO = {
  santo_domingo: 'Delivery Santo Domingo',
  interior:      'Envío al interior',
}

function formatFecha(isoStr) {
  return new Date(isoStr).toLocaleDateString('es-DO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function MiCuenta() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [loadingPedidos, setLoadingPedidos] = useState(true)
  const [errorPedidos, setErrorPedidos] = useState(null)
  const [abierto, setAbierto] = useState(null)
  const [detalles, setDetalles] = useState({})
  const [loadingDetalle, setLoadingDetalle] = useState({})

  useEffect(() => {
    getMisPedidos()
      .then(setPedidos)
      .catch(() => setErrorPedidos('No se pudo cargar el historial.'))
      .finally(() => setLoadingPedidos(false))
  }, [])

  async function togglePedido(id) {
    if (abierto === id) {
      setAbierto(null)
      return
    }
    setAbierto(id)
    if (detalles[id]) return
    setLoadingDetalle((prev) => ({ ...prev, [id]: true }))
    try {
      const data = await getPedido(id)
      setDetalles((prev) => ({ ...prev, [id]: data }))
    } catch {
      setDetalles((prev) => ({ ...prev, [id]: [] }))
    } finally {
      setLoadingDetalle((prev) => ({ ...prev, [id]: false }))
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#3d2314] mb-8">Mi cuenta</h1>

      {/* Perfil */}
      <section className="bg-[#fbddc3]/20 rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-[#3d2314]/50 mb-0.5">Nombre</p>
          <p className="font-semibold text-[#3d2314] text-lg">{usuario?.nombre}</p>
          <p className="text-sm text-[#3d2314]/60 mt-1">{usuario?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-[#3d2314]/20 text-[#3d2314]/70 hover:text-[#3d2314] hover:border-[#3d2314] rounded-full px-5 py-2.5 text-sm transition-colors"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </section>

      {/* Historial */}
      <section>
        <h2 className="font-semibold text-[#3d2314] text-lg mb-4">Historial de pedidos</h2>

        {loadingPedidos ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#3d2314]/40" />
          </div>
        ) : errorPedidos ? (
          <p className="text-sm text-red-500">{errorPedidos}</p>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <ShoppingBag size={40} className="text-[#fbddc3]" />
            <p className="text-[#3d2314]/60 text-sm">Aún no tienes pedidos.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pedidos.map((p) => (
              <div key={p.id} className="border border-[#fbddc3] rounded-2xl overflow-hidden">
                <button
                  onClick={() => togglePedido(p.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#fbddc3]/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-wrap min-w-0">
                    <span className="text-xs text-[#3d2314]/40 font-mono flex-shrink-0">#{p.id}</span>
                    <span className="text-sm text-[#3d2314]/70 flex-shrink-0">{formatFecha(p.created_at)}</span>
                    <span className="text-sm font-semibold text-[#3d2314] flex-shrink-0">
                      RD${Number(p.total).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#3d2314]/50 flex-shrink-0">
                      {LABEL_ENVIO[p.tipo_envio] ?? p.tipo_envio}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${BADGE[p.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                      {LABEL_ESTADO[p.estado] ?? p.estado}
                    </span>
                    {abierto === p.id
                      ? <ChevronUp size={15} className="text-[#3d2314]/40" />
                      : <ChevronDown size={15} className="text-[#3d2314]/40" />
                    }
                  </div>
                </button>

                {abierto === p.id && (
                  <div className="border-t border-[#fbddc3] px-5 py-4 bg-white">
                    {loadingDetalle[p.id] ? (
                      <div className="flex justify-center py-4">
                        <Loader2 size={18} className="animate-spin text-[#3d2314]/40" />
                      </div>
                    ) : (detalles[p.id]?.items ?? []).length === 0 ? (
                      <p className="text-sm text-[#3d2314]/50">Sin items.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {(detalles[p.id]?.items ?? []).map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-4 text-sm">
                            <div className="min-w-0">
                              <p className="font-medium text-[#3d2314]">
                                {item.nombre_producto} × {item.cantidad}
                              </p>
                              {item.mensaje && (
                                <p className="text-xs text-[#3d2314]/50 mt-0.5">Mensaje: {item.mensaje}</p>
                              )}
                              {item.personalizacion && (
                                <p className="text-xs text-[#3d2314]/50">Personalización: {item.personalizacion}</p>
                              )}
                            </div>
                            <span className="text-[#3d2314]/70 flex-shrink-0">
                              RD${Number(item.precio_unitario * item.cantidad).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-[#fbddc3] pt-3 flex flex-col gap-1 text-xs text-[#3d2314]/60">
                          <div className="flex justify-between">
                            <span>Envío</span>
                            <span>RD$250</span>
                          </div>
                          <div className="flex justify-between font-semibold text-[#3d2314] text-sm">
                            <span>Total</span>
                            <span>RD${Number(detalles[p.id]?.total ?? p.total ?? 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Adelanto requerido (50%)</span>
                            <span>RD${Number(detalles[p.id]?.adelanto ?? p.adelanto ?? 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
