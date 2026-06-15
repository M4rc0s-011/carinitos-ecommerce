import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader2, X, Upload } from 'lucide-react'
import {
  getProductosAdmin,
  createProducto,
  updateProducto,
  deleteProducto,
  activarProducto,
  getCategorias,
} from '../../api/admin'

const EMPTY_FORM = {
  nombre:       '',
  descripcion:  '',
  precio:       '',
  stock:        '',
  categoria_id: '',
  imagen:       '',
}

function ModalProducto({ producto, categorias, onClose, onSaved }) {
  const editando = !!producto
  const [form, setForm] = useState(
    editando
      ? {
          nombre:       producto.nombre ?? '',
          descripcion:  producto.descripcion ?? '',
          precio:       String(producto.precio ?? ''),
          stock:        String(producto.stock ?? ''),
          categoria_id: String(producto.categoria_id ?? ''),
          imagen:       producto.imagen ?? '',
        }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorServidor, setErrorServidor] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function selectFile(file) {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    set('imagen', URL.createObjectURL(file))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.precio || Number(form.precio) <= 0) e.precio = 'Debe ser mayor a 0'
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Debe ser 0 o más'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setLoading(true)
    setErrorServidor(null)
    try {
      const fd = new FormData()
      fd.append('nombre', form.nombre.trim())
      if (form.descripcion.trim()) fd.append('descripcion', form.descripcion.trim())
      fd.append('precio', String(Number(form.precio)))
      fd.append('stock', String(Number(form.stock)))
      if (form.categoria_id) fd.append('categoria_id', String(Number(form.categoria_id)))
      if (imageFile) {
        fd.append('imagen', imageFile)
      } else if (!form.imagen) {
        fd.append('imagen', '')
      }
      // form.imagen exists + no imageFile → no change → don't append
      if (editando) {
        await updateProducto(producto.id, fd)
      } else {
        await createProducto(fd)
      }
      onSaved()
    } catch {
      setErrorServidor('Error al guardar el producto.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-3 py-2 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-400'
        : 'border-[#fbddc3] focus:border-[#3d2314]'
    }`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#3d2314]">
            {editando ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-[#3d2314]/40 hover:text-[#3d2314] transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#3d2314]">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={inputClass('nombre')}
              placeholder="Nombre del producto"
            />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#3d2314]">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={3}
              className="w-full border border-[#fbddc3] focus:border-[#3d2314] rounded-xl px-3 py-2 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors resize-none"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#3d2314]">Precio (RD$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => set('precio', e.target.value)}
                className={inputClass('precio')}
                placeholder="0.00"
              />
              {errors.precio && <p className="text-xs text-red-500">{errors.precio}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#3d2314]">Stock *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                className={inputClass('stock')}
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#3d2314]">Categoría</label>
            <select
              value={form.categoria_id}
              onChange={(e) => set('categoria_id', e.target.value)}
              className="w-full border border-[#fbddc3] focus:border-[#3d2314] rounded-xl px-3 py-2 text-sm text-[#3d2314] focus:outline-none transition-colors bg-white"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#3d2314]">Imagen</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const f = e.dataTransfer.files[0]
                if (f) selectFile(f)
              }}
              className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 min-h-[100px] ${
                dragging
                  ? 'border-[#3d2314]/40 bg-[#fbddc3]/10'
                  : 'border-[#fbddc3] hover:border-[#3d2314]/30'
              }`}
            >
              {form.imagen ? (
                <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={form.imagen}
                    alt="preview"
                    className="w-full h-32 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { set('imagen', ''); setImageFile(null) }}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-[#3d2314]/50 hover:text-[#3d2314] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-[#3d2314]/20" />
                  <p className="text-xs text-[#3d2314]/40 text-center">
                    Arrastra una imagen o haz click para seleccionar
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files[0]; if (f) selectFile(f) }}
            />
          </div>

          {errorServidor && (
            <p className="text-sm text-red-500 text-center">{errorServidor}</p>
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#3d2314]/20 text-[#3d2314]/70 hover:text-[#3d2314] hover:border-[#3d2314] rounded-full py-2.5 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3d2314] text-[#fbddc3] rounded-full py-2.5 text-sm font-medium hover:bg-[#5a3520] transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {editando ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [toggling, setToggling] = useState({})

  async function cargar() {
    try {
      const [prods, cats] = await Promise.all([getProductosAdmin(), getCategorias()])
      setProductos(prods)
      setCategorias(cats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  function abrirCrear() { setEditando(null); setModal(true) }
  function abrirEditar(p) { setEditando(p); setModal(true) }

  async function handleSaved() {
    setModal(false)
    setEditando(null)
    await cargar()
  }

  async function toggleActivo(p) {
    setToggling((prev) => ({ ...prev, [p.id]: true }))
    try {
      if (p.activo) {
        await deleteProducto(p.id)
      } else {
        await activarProducto(p.id)
      }
      setProductos((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, activo: !x.activo } : x))
      )
    } finally {
      setToggling((prev) => ({ ...prev, [p.id]: false }))
    }
  }

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-[#3d2314]">Productos</h1>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#3d2314] text-[#fbddc3] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors"
        >
          <Plus size={15} />
          Nuevo producto
        </button>
      </div>

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
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Imagen</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Nombre</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Precio</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Categoría</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#3d2314]/50">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fbddc3]/50">
                {productos.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#fbddc3]/5 transition-colors ${!p.activo ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      {p.imagen ? (
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#fbddc3]/30 flex items-center justify-center text-[#3d2314]/20 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#3d2314]">{p.nombre}</td>
                    <td className="px-4 py-3 text-[#3d2314]/70">RD${Number(p.precio).toLocaleString()}</td>
                    <td className="px-4 py-3 text-[#3d2314]/70">{p.stock}</td>
                    <td className="px-4 py-3 text-[#3d2314]/70">{nombreCategoria(p.categoria_id)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          p.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="p-1.5 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggleActivo(p)}
                          disabled={!!toggling[p.id]}
                          className="p-1.5 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors disabled:opacity-40"
                          title={p.activo ? 'Desactivar' : 'Activar'}
                        >
                          {toggling[p.id] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : p.activo ? (
                            <ToggleRight size={16} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={16} className="text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productos.length === 0 && (
              <p className="text-center text-sm text-[#3d2314]/40 py-12">Sin productos.</p>
            )}
          </div>
        </div>
      )}

      {modal && (
        <ModalProducto
          producto={editando}
          categorias={categorias}
          onClose={() => { setModal(false); setEditando(null) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
