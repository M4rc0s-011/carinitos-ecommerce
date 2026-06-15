import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#3d2314] text-[#fbddc3] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-display text-3xl block mb-1">Cariñitos by Jossy</span>
          <p className="text-sm opacity-70">Colgantes artesanales llenos de cariño.</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <nav className="flex gap-6 text-sm">
            <Link to="/" className="hover:opacity-80 transition-opacity">Inicio</Link>
            <Link to="/catalogo" className="hover:opacity-80 transition-opacity">Catálogo</Link>
            <Link to="/sobre-mi" className="hover:opacity-80 transition-opacity">Contacto</Link>
          </nav>
          <a
            href="https://www.instagram.com/carinitosbyjossy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#fbddc3]/70 hover:text-[#fbddc3] transition-colors"
            aria-label="Instagram de Cariñitos by Jossy"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-xs">@carinitosbyjossy</span>
          </a>
        </div>
      </div>

      <div className="border-t border-[#fbddc3]/20 text-center text-xs py-4 text-[#fbddc3]/60 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4">
        <span>© 2025 Cariñitos by Jossy. Todos los derechos reservados.</span>
        <Link to="/politica-privacidad" className="hover:text-[#fbddc3] transition-colors">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
