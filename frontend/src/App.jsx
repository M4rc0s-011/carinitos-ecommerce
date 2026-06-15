import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RutaProtegida from './components/RutaProtegida'
import RutaAdmin from './components/RutaAdmin'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import SobreMi from './pages/SobreMi'
import Login from './pages/Login'
import Registro from './pages/Registro'
import MiCuenta from './pages/MiCuenta'
import VerificarEmail from './pages/VerificarEmail'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProductos from './pages/admin/AdminProductos'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminCategorias from './pages/admin/AdminCategorias'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import NotFound from './pages/NotFound'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas — con Navbar y Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/sobre-mi" element={<SobreMi />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/mi-cuenta" element={<RutaProtegida><MiCuenta /></RutaProtegida>} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Panel admin — sin Navbar ni Footer */}
          <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
