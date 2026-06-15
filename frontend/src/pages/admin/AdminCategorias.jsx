import { useState, useEffect } from 'react'
import { Plus, Tag, Loader2, Pencil, Trash2, Check, X } from 'lucide-react'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../api/admin'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [nuevaNombre, setNuevaNombre] = useState('')
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [editandoNombre, setEditandoNombre] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorFila, setErrorFila] = useState(null)

  async function cargar() {
    try {
      const data = await getCategorias()
      setCategorias(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function handleAgregar(e) {
    e.preventDefault()
    const nombre = nuevaNombre.trim()
    if (!nombre) return
    setCreando(true)
    setError(null)
    try {
      await createCategoria(nombre)
      setNuevaNombre('')
      await cargar()
    } catch {
      setError('Error al crear la colección.')
    } finally {
      setCreando(false)
    }
  }

  function iniciarEdicion(c) {
    setEditandoId(c.id)
    setEditandoNombre(c.nombre)
    setConfirmandoId(null)
    setErrorFila(null)
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setEditandoNombre('')
    setErrorFila(null)
  }

  async function guardarEdicion(id) {
    const nombre = editandoNombre.trim()
    if (!nombre) return
    setGuardando(true)
    setErrorFila(null)
    try {
      await updateCategoria(id, nombre)
      setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, nombre } : c)))
      setEditandoId(null)
    } catch {
      setErrorFila('Error al guardar.')
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar(id) {
    setEliminando(true)
    setErrorFila(null)
    try {
      await deleteCategoria(id)
      setCategorias((prev) => prev.filter((c) => c.id !== id))
      setConfirmandoId(null)
    } catch (err) {
      const msg = err?.response?.data?.error ?? 'Error al eliminar.'
      setErrorFila(msg)
      setConfirmandoId(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[#3d2314] mb-6">Colecciones</h1>

      <div className="max-w-md flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#3d2314]/40" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#fbddc3] divide-y divide-[#fbddc3]/50">
            {categorias.length === 0 ? (
              <p className="text-sm text-[#3d2314]/40 text-center py-8">Sin colecciones.</p>
            ) : (
              categorias.map((c) => (
                <div key={c.id} className="px-4 py-3">
                  {editandoId === c.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editandoNombre}
                        onChange={(e) => setEditandoNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') guardarEdicion(c.id)
                          if (e.key === 'Escape') cancelarEdicion()
                        }}
                        className="flex-1 border border-[#fbddc3] focus:border-[#3d2314] rounded-lg px-2.5 py-1.5 text-sm text-[#3d2314] focus:outline-none transition-colors"
                      />
                      <button
                        onClick={() => guardarEdicion(c.id)}
                        disabled={guardando || !editandoNombre.trim()}
                        className="p-1.5 text-green-600 hover:text-green-700 disabled:opacity-40 transition-colors"
                      >
                        {guardando ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="p-1.5 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : confirmandoId === c.id ? (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-[#3d2314]/70">
                        ¿Eliminar <span className="font-semibold">{c.nombre}</span>?
                      </p>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => confirmarEliminar(c.id)}
                          disabled={eliminando}
                          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-40 transition-colors"
                        >
                          {eliminando ? <Loader2 size={12} className="animate-spin" /> : 'Eliminar'}
                        </button>
                        <button
                          onClick={() => setConfirmandoId(null)}
                          className="text-xs text-[#3d2314]/50 hover:text-[#3d2314] transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group">
                      <Tag size={14} className="text-[#3d2314]/30 flex-shrink-0" />
                      <span className="text-sm text-[#3d2314] flex-1">{c.nombre}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => iniciarEdicion(c)}
                          className="p-1 text-[#3d2314]/30 hover:text-[#3d2314] transition-colors"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { setConfirmandoId(c.id); setEditandoId(null); setErrorFila(null) }}
                          className="p-1 text-[#3d2314]/30 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {errorFila && <p className="text-sm text-red-500">{errorFila}</p>}

        <form onSubmit={handleAgregar} className="flex gap-2">
          <input
            type="text"
            value={nuevaNombre}
            onChange={(e) => { setNuevaNombre(e.target.value); setError(null) }}
            placeholder="Nueva colección..."
            className="flex-1 border border-[#fbddc3] focus:border-[#3d2314] rounded-xl px-3 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={creando || !nuevaNombre.trim()}
            className="flex items-center gap-1.5 bg-[#3d2314] text-[#fbddc3] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#5a3520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {creando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Agregar
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
