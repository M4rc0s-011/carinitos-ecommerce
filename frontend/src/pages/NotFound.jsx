import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-6">
        <span className="font-display text-7xl text-[#fbddc3]">404</span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-[#3d2314]">¡Ups! Esta página no existe</h1>
          <p className="text-sm text-[#3d2314]/60 leading-relaxed">
            Parece que el colgante que buscas se perdió en el camino 🌸
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            to="/"
            className="flex-1 bg-[#3d2314] text-[#fbddc3] py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors text-center"
          >
            Volver al inicio
          </Link>
          <Link
            to="/catalogo"
            className="flex-1 border border-[#fbddc3] text-[#3d2314] py-3 rounded-full text-sm font-medium hover:bg-[#fbddc3]/30 transition-colors text-center"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
