import { Link } from 'react-router-dom'

export default function ProductCard({ producto }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#fbddc3] hover:shadow-lg transition-shadow animate-card-enter">
      <Link to={`/producto/${producto.id}`} className="block w-full aspect-[3/4] bg-[#fbddc3] overflow-hidden">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-display text-[#3d2314]/40 text-lg">Cariñitos</span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/producto/${producto.id}`}>
          <h3 className="font-medium text-[#3d2314] text-sm mb-1 hover:underline">{producto.nombre}</h3>
        </Link>
        <p className="text-xs text-[#3d2314]/60 mb-3 line-clamp-2">{producto.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#3d2314]">RD$ {producto.precio.toLocaleString()}</span>
          <Link
            to={`/producto/${producto.id}`}
            className="text-xs bg-[#3d2314] text-[#fbddc3] px-3 py-1.5 rounded-full hover:bg-[#5a3520] transition-colors"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  )
}
