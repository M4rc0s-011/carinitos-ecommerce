import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, LogOut, Menu, X, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin',            label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/productos',  label: 'Productos',   icon: Package },
  { to: '/admin/pedidos',    label: 'Pedidos',     icon: ShoppingBag },
  { to: '/admin/categorias', label: 'Colecciones', icon: Tag },
  { to: '/admin/usuarios',   label: 'Usuarios',    icon: Users },
]

function SidebarContent({ onLinkClick }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-[#fbddc3]/20">
        <p className="font-display text-2xl text-[#fbddc3] leading-none">Cariñitos</p>
        <p className="text-xs text-[#fbddc3]/40 mt-1">Panel de administración</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[#fbddc3]/15 text-[#fbddc3] font-medium'
                  : 'text-[#fbddc3]/60 hover:text-[#fbddc3] hover:bg-[#fbddc3]/10'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#fbddc3]/20 flex flex-col gap-1">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#fbddc3]/60 hover:text-[#fbddc3] hover:bg-[#fbddc3]/10 transition-colors"
        >
          <Home size={16} />
          Ir a Home
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#fbddc3]/60 hover:text-[#fbddc3] hover:bg-[#fbddc3]/10 transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-[#3d2314] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-56 bg-[#3d2314] transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-[#fbddc3] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#3d2314]"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <p className="font-display text-xl text-[#3d2314]">Admin</p>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
