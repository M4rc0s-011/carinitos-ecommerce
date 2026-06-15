import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modalLogout, setModalLogout] = useState(false)
  const dropdownRef = useRef(null)
  const { totalItems } = useCarrito()
  const { usuario, token, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/sobre-mi', label: 'Sobre mí' },
  ]

  function handleLogoutConfirm() {
    setModalLogout(false)
    setDropdownOpen(false)
    setOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#fbddc3]">
      {modalLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl text-[#3d2314] mb-2">¿Cerrar sesión?</h2>
              <p className="text-sm text-[#3d2314]/70">¿Estás seguro de que deseas salir de tu cuenta?</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogoutConfirm}
                className="w-full bg-[#3d2314] text-[#fbddc3] py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors"
              >
                Sí, salir
              </button>
              <button
                onClick={() => setModalLogout(false)}
                className="w-full py-3 rounded-full text-sm font-medium text-[#3d2314]/60 hover:text-[#3d2314] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-21 flex items-center justify-between">
        <Link to="/" className="font-display text-3xl md:text-6xl text-[#3d2314] leading-none">
          CariñitosbyJossy
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-[#3d2314] hover:text-[#c47a5a] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 text-sm text-[#3d2314] hover:text-[#c47a5a] transition-colors"
                >
                  <User size={16} />
                  {usuario?.nombre?.split(' ')[0]}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#fbddc3] rounded-xl shadow-lg overflow-hidden z-50">
                    <Link
                      to="/mi-cuenta"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#3d2314] hover:bg-[#fbddc3]/30 transition-colors"
                    >
                      <User size={14} />
                      Mi cuenta
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[#3d2314] hover:bg-[#fbddc3]/30 transition-colors"
                      >
                        <Settings size={14} />
                        Panel admin
                      </Link>
                    )}
                    <button
                      onClick={() => { setDropdownOpen(false); setModalLogout(true) }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#3d2314] hover:bg-[#fbddc3]/30 transition-colors border-t border-[#fbddc3]"
                    >
                      <LogOut size={14} />
                      Salir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm text-[#3d2314] hover:text-[#c47a5a] transition-colors"
            >
              <User size={16} />
              Iniciar sesión
            </Link>
          )}

          <Link to="/carrito" className="flex items-center gap-2 text-[#3d2314] hover:text-[#c47a5a] transition-colors px-2 py-2">
            <div className="relative">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3d2314] text-[#fbddc3] text-[10px] rounded-full flex items-center justify-center font-medium leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">Tu carrito</span>
          </Link>

          <button
            className="md:hidden p-2 text-[#3d2314]"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#fbddc3] px-4 py-4 flex flex-col gap-4">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-[#3d2314]"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {token ? (
            <>
              {isAdmin() && (
                <Link to="/admin" className="text-sm text-[#3d2314]" onClick={() => setOpen(false)}>
                  Panel admin
                </Link>
              )}
              <Link to="/mi-cuenta" className="text-sm text-[#3d2314]" onClick={() => setOpen(false)}>
                Mi cuenta ({usuario?.nombre?.split(' ')[0]})
              </Link>
              <button
                onClick={() => { setOpen(false); setModalLogout(true) }}
                className="text-sm text-[#3d2314] text-left"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-[#3d2314]" onClick={() => setOpen(false)}>
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
