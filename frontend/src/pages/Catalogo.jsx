import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, PackageSearch, X, AlertCircle } from 'lucide-react'
import { getProductos, getCategorias } from '../api/productos'
import ProductCard from '../components/ProductCard'

const ORDEN_OPTIONS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'vendidos', label: 'Más vendidos' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
]

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-[#fbddc3] border-t-[#3d2314] animate-spin" />
      <p className="text-sm text-[#3d2314]/40">Cargando productos...</p>
    </div>
  )
}

export default function Catalogo() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [colecciones, setColecciones] = useState(new Set())
  const [ordenar, setOrdenar] = useState('recientes')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [listaColecciones, setListaColecciones] = useState([])

  useEffect(() => {
    getCategorias().then(setListaColecciones).catch(() => { })
  }, [])

  const cargarProductos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductos({
        busqueda: busqueda || undefined,
        precio_min: precioMin || undefined,
        precio_max: precioMax || undefined,
        ordenar,
        // coleccion viene del campo categoria_nombre del backend
        // si hay colecciones seleccionadas se envía la primera (el backend filtra por categoria_id)
        // por ahora se filtra localmente hasta tener IDs de categoría
      })
      const filtrados = colecciones.size > 0
        ? data.filter((p) => colecciones.has(p.categoria_id))
        : data
      setProductos(filtrados)
    } catch {
      setError('No se pudo cargar el catálogo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [busqueda, precioMin, precioMax, colecciones, ordenar])

  useEffect(() => {
    const timer = setTimeout(cargarProductos, busqueda ? 350 : 0)
    return () => clearTimeout(timer)
  }, [cargarProductos, busqueda])

  function toggleColeccion(col) {
    setColecciones((prev) => {
      const next = new Set(prev)
      next.has(col) ? next.delete(col) : next.add(col)
      return next
    })
  }

  function limpiarFiltros() {
    setBusqueda('')
    setPrecioMin('')
    setPrecioMax('')
    setColecciones(new Set())
    setOrdenar('recientes')
  }

  const hayFiltrosActivos = busqueda || precioMin !== '' || precioMax !== '' || colecciones.size > 0

  const panelFiltros = (
    <div className="flex flex-col gap-6">
      {/* Rango de precio */}
      <div>
        <h3 className="text-sm font-semibold text-[#3d2314] mb-3">Precio</h3>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="Mín"
            className="w-full border border-[#fbddc3] rounded-xl px-3 py-2 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
          />
          <input
            type="number"
            min="0"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Máx"
            className="w-full border border-[#fbddc3] rounded-xl px-3 py-2 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
          />
        </div>
      </div>

      {/* Colección */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#3d2314]">Colección</h3>
          {colecciones.size > 0 && (
            <button
              onClick={() => setColecciones(new Set())}
              className="text-xs text-[#3d2314]/50 hover:text-[#3d2314] transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {listaColecciones.map((col) => (
            <label key={col.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={colecciones.has(col.id)}
                onChange={() => toggleColeccion(col.id)}
                className="w-4 h-4 rounded border-[#fbddc3] accent-[#3d2314] cursor-pointer"
              />
              <span className="text-sm text-[#3d2314]/80 group-hover:text-[#3d2314] transition-colors">
                {col.nombre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar */}
      <div>
        <h3 className="text-sm font-semibold text-[#3d2314] mb-3">Ordenar por</h3>
        <div className="flex flex-col gap-2">
          {ORDEN_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="ordenar"
                value={value}
                checked={ordenar === value}
                onChange={() => setOrdenar(value)}
                className="w-4 h-4 accent-[#3d2314] cursor-pointer"
              />
              <span className="text-sm text-[#3d2314]/80 group-hover:text-[#3d2314] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hayFiltrosActivos && (
        <button
          onClick={limpiarFiltros}
          className="w-full border border-[#3d2314]/30 text-[#3d2314]/60 hover:text-[#3d2314] hover:border-[#3d2314] rounded-full py-2 text-sm transition-colors"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#3d2314] mb-6">Catálogo</h1>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d2314]/40 pointer-events-none" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full border border-[#fbddc3] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
        />
      </div>

      {/* Toggle filtros mobile */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <p className="text-xs text-[#3d2314]/50">
          {loading ? '...' : `${productos.length} ${productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
        </p>
        <button
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="flex items-center gap-2 text-sm text-[#3d2314] border border-[#fbddc3] rounded-full px-4 py-2 hover:border-[#3d2314]/40 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filtros
          {hayFiltrosActivos && <span className="w-2 h-2 rounded-full bg-[#3d2314] ml-0.5" />}
        </button>
      </div>

      {/* Panel filtros mobile colapsable */}
      {filtrosAbiertos && (
        <div className="lg:hidden bg-white border border-[#fbddc3] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#3d2314]">Filtros</span>
            <button onClick={() => setFiltrosAbiertos(false)}>
              <X size={16} className="text-[#3d2314]/50 hover:text-[#3d2314] transition-colors" />
            </button>
          </div>
          {panelFiltros}
        </div>
      )}

      <div className="flex gap-10">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          {panelFiltros}
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <p className="hidden lg:block text-xs text-[#3d2314]/50 mb-4">
            {loading ? '...' : `${productos.length} ${productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
          </p>

          {error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <AlertCircle size={40} className="text-[#fbddc3]" />
              <p className="text-[#3d2314]/60 text-sm">{error}</p>
              <button
                onClick={cargarProductos}
                className="text-sm text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520] transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : loading ? (
            <Spinner />
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <PackageSearch size={40} className="text-[#fbddc3]" />
              <p className="text-[#3d2314]/60 text-sm">No se encontraron productos.</p>
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520] transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((p, i) => (
                <ProductCard key={`${p.id}-${i}`} producto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
