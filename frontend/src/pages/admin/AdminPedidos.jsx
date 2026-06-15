import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react'
import { getPedidosAdmin, getPedidoAdmin, updateEstadoPedido, deletePedidoAdmin } from '../../api/admin'

const ESTADOS = ['pendiente', 'en_proceso', 'completado', 'cancelado']

const BADGE = {
  pendiente:  'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
  cancelado:  'bg-red-100 text-red-800',
}

const BADGE_DOT = {
  pendiente:  'bg-yellow-400',
  en_proceso: 'bg-blue-400',
  completado: 'bg-green-500',
  cancelado:  'bg-red-400',
}

const LABEL_ESTADO = {
  pendiente:  'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
  cancelado:  'Cancelado',
}

const LABEL_ENVIO = {
  santo_domingo: 'Delivery SD',
  interior:      'Interior',
}

function formatFecha(isoStr) {
  return new Date(isoStr).toLocaleDateString('es-DO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [abierto, setAbierto] = useState(null)
  const [detalles, setDetalles] = useState({})
  const [loadingDetalle, setLoadingDetalle] = useState({})
  const [actualizando, setActualizando] = useState({})
  const [openDropdown, setOpenDropdown] = useState(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const [eliminando, setEliminando] = useState({})

  useEffect(() => {
    getPedidosAdmin()
      .then(setPedidos)
      .finally(() => setLoading(false))
  }, [])

  async function togglePedido(id) {
    if (abierto === id) { setAbierto(null); return }
    setAbierto(id)
    if (detalles[id]) return
    setLoadingDetalle((prev) => ({ ...prev, [id]: true }))
    try {
      const data = await getPedidoAdmin(id)
      setDetalles((prev) => ({ ...prev, [id]: data }))
    } catch {
      setDetalles((prev) => ({ ...prev, [id]: {} }))
    } finally {
      setLoadingDetalle((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function handleEliminar(e, id) {
    e.stopPropagation()
    if (!window.confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    setEliminando((prev) => ({ ...prev, [id]: true }))
    try {
      await deletePedidoAdmin(id)
      setPedidos((prev) => prev.filter((p) => p.id !== id))
      if (abierto === id) setAbierto(null)
    } catch {
      // silent — pedido stays in list
    } finally {
      setEliminando((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function handleEstado(id, nuevoEstado) {
    const prevEstado = pedidos.find((p) => p.id === id)?.estado
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    )
    setActualizando((prev) => ({ ...prev, [id]: true }))
    try {
      await updateEstadoPedido(id, nuevoEstado)
    } catch {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: prevEstado } : p))
      )
    } finally {
      setActualizando((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[#3d2314] mb-6">Pedidos</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#3d2314]/40" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#fbddc3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#fbddc3] bg-[#fbddc3]/10 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">#</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">Cliente</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">Total / Adelanto</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">Envío</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">Estado</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#3d2314]/50">Fecha</th>
                  <th className="px-5 py-3.5"></th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fbddc3]/40">
                {pedidos.map((p) => (
                  <>
                    <tr
                      key={p.id}
                      className="hover:bg-[#fbddc3]/5 transition-colors cursor-pointer"
                      onClick={() => togglePedido(p.id)}
                    >
                      <td className="px-5 py-4 font-mono text-xs text-[#3d2314]/40">#{p.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#3d2314] leading-tight">{p.usuario_nombre}</p>
                        <p className="text-xs text-[#3d2314]/45 mt-0.5">{p.usuario_email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#3d2314]">RD${Number(p.total).toLocaleString()}</p>
                        <p className="text-xs text-[#3d2314]/45 mt-0.5">
                          adelanto RD${Number(p.adelanto).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#3d2314]/60 text-xs">
                        {LABEL_ENVIO[p.tipo_envio] ?? p.tipo_envio ?? '—'}
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              if (openDropdown === p.id) { setOpenDropdown(null); return }
                              const rect = e.currentTarget.getBoundingClientRect()
                              setDropdownPos({ top: rect.bottom + 4, left: rect.left })
                              setOpenDropdown(p.id)
                            }}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors ${BADGE[p.estado] ?? 'bg-gray-100 text-gray-700'}`}
                          >
                            {actualizando[p.id]
                              ? <Loader2 size={10} className="animate-spin flex-shrink-0" />
                              : <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${BADGE_DOT[p.estado]}`} />
                            }
                            {LABEL_ESTADO[p.estado]}
                            <ChevronDown size={10} className="flex-shrink-0" />
                          </button>
                          {openDropdown === p.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div
                                className="fixed z-20 bg-white rounded-xl shadow-lg border border-[#fbddc3]/80 py-1 min-w-[148px]"
                                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                              >
                                {ESTADOS.map((est) => (
                                  <button
                                    key={est}
                                    onClick={() => { handleEstado(p.id, est); setOpenDropdown(null) }}
                                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#fbddc3]/20 transition-colors ${p.estado === est ? 'font-semibold' : ''}`}
                                  >
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${BADGE_DOT[est]}`} />
                                    {LABEL_ESTADO[est]}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#3d2314]/45 text-xs whitespace-nowrap">
                        {formatFecha(p.created_at)}
                      </td>
                      <td className="px-5 py-4 text-[#3d2314]/30">
                        {abierto === p.id
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />
                        }
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleEliminar(e, p.id)}
                          disabled={eliminando[p.id]}
                          className="p-1.5 rounded-lg text-[#3d2314]/25 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          {eliminando[p.id]
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      </td>
                    </tr>

                    {abierto === p.id && (
                      <tr key={`${p.id}-detail`}>
                        <td colSpan={8} className="px-6 py-5 bg-[#fbddc3]/5 border-b border-[#fbddc3]/30">
                          {loadingDetalle[p.id] ? (
                            <div className="flex justify-center py-4">
                              <Loader2 size={16} className="animate-spin text-[#3d2314]/40" />
                            </div>
                          ) : (detalles[p.id]?.items ?? []).length === 0 ? (
                            <p className="text-sm text-[#3d2314]/50">Sin items.</p>
                          ) : (
                            <div className="flex flex-col gap-3 max-w-xl">
                              {(detalles[p.id]?.items ?? []).map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-start justify-between gap-4 bg-white rounded-xl px-4 py-3 border border-[#fbddc3]/60"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#3d2314] text-sm">
                                      {item.nombre_producto}
                                      <span className="font-normal text-[#3d2314]/50 ml-1">× {item.cantidad}</span>
                                    </p>
                                    {item.mensaje && (
                                      <p className="text-xs text-[#3d2314]/55 mt-1">
                                        <span className="font-medium">Mensaje:</span> {item.mensaje}
                                      </p>
                                    )}
                                    {item.personalizacion && (
                                      <p className="text-xs text-[#3d2314]/55 mt-0.5">
                                        <span className="font-medium">Personalización:</span> {item.personalizacion}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-[#3d2314] flex-shrink-0">
                                    RD${Number(item.precio_unitario * item.cantidad).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            {pedidos.length === 0 && (
              <p className="text-center text-sm text-[#3d2314]/40 py-12">Sin pedidos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
