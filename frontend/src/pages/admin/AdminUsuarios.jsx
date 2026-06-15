import { useState, useEffect } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { getUsuarios, limpiarUsuarios, deleteUsuario } from '../../api/admin'

function formatFecha(isoStr) {
  return new Date(isoStr).toLocaleDateString('es-DO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [limpiando, setLimpiando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorFila, setErrorFila] = useState(null)

  async function cargar() {
    const data = await getUsuarios()
    setUsuarios(data)
  }

  useEffect(() => {
    cargar().finally(() => setLoading(false))
  }, [])

  async function handleLimpiar() {
    setLimpiando(true)
    setResultado(null)
    try {
      const data = await limpiarUsuarios()
      setResultado(data.eliminados)
      await cargar()
    } catch {
      setResultado(-1)
    } finally {
      setLimpiando(false)
      setConfirmando(false)
    }
  }

  async function handleEliminar(id) {
    setEliminando(true)
    setErrorFila(null)
    try {
      await deleteUsuario(id)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
      setConfirmandoId(null)
    } catch (err) {
      setErrorFila(err?.response?.data?.error ?? 'Error al eliminar.')
      setConfirmandoId(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-[#3d2314]">Usuarios</h1>

        {confirmando ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <p className="text-xs text-red-700">¿Eliminar usuarios con "prueba" o "test"?</p>
            <button
              onClick={handleLimpiar}
              disabled={limpiando}
              className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              {limpiando && <Loader2 size={11} className="animate-spin" />}
              Confirmar
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setConfirmando(true); setResultado(null) }}
            className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <Trash2 size={13} />
            Limpiar usuarios de prueba
          </button>
        )}
      </div>

      {resultado !== null && (
        <p className={`text-sm mb-4 ${resultado === -1 ? 'text-red-500' : 'text-[#3d2314]/60'}`}>
          {resultado === -1
            ? 'Error al limpiar.'
            : resultado === 0
            ? 'No se encontraron usuarios de prueba.'
            : `${resultado} usuario${resultado !== 1 ? 's' : ''} eliminado${resultado !== 1 ? 's' : ''}.`
          }
        </p>
      )}

      {errorFila && (
        <p className="text-sm text-red-500 mb-4">{errorFila}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#3d2314]/40" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#fbddc3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#fbddc3] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Nombre</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Rol</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Registro</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fbddc3]/50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-[#fbddc3]/5 transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs text-[#3d2314]/40">#{u.id}</td>
                    <td className="px-4 py-3 font-medium text-[#3d2314]">{u.nombre}</td>
                    <td className="px-4 py-3 text-[#3d2314]/60">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.rol === 'admin'
                            ? 'bg-[#3d2314] text-[#fbddc3]'
                            : 'bg-[#fbddc3]/40 text-[#3d2314]'
                        }`}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3d2314]/50 text-xs">{formatFecha(u.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {u.rol !== 'admin' && (
                        confirmandoId === u.id ? (
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-xs text-[#3d2314]/60">¿Eliminar?</span>
                            <button
                              onClick={() => handleEliminar(u.id)}
                              disabled={eliminando}
                              className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-40 transition-colors"
                            >
                              {eliminando ? <Loader2 size={11} className="animate-spin" /> : 'Sí'}
                            </button>
                            <button
                              onClick={() => setConfirmandoId(null)}
                              className="text-xs text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setConfirmandoId(u.id); setErrorFila(null) }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#3d2314]/30 hover:text-red-500 transition-all"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuarios.length === 0 && (
              <p className="text-center text-sm text-[#3d2314]/40 py-12">Sin usuarios.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
