import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { login as apiLogin } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchParams] = useSearchParams()
  const mensajeExterno = location.state?.mensaje ?? null
  const emailVerificado = searchParams.get('verificado') === 'true'
  const destino = location.state?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { token, usuario } = await apiLogin({ email, password })
      login(token, usuario)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-[#3d2314] text-center mb-2">
          Iniciar sesión
        </h1>
        <p className="text-sm text-[#3d2314]/60 text-center mb-8">
          Bienvenida a Cariñitos by Jossy
        </p>

        {emailVerificado && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
            Email verificado. Ya puedes iniciar sesión.
          </div>
        )}

        {mensajeExterno && (
          <div className="mb-6 bg-[#edbce0]/40 border border-[#edbce0] rounded-xl px-4 py-3 text-sm text-[#3d2314]">
            {mensajeExterno}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3d2314]">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tucorreo@email.com"
              className="w-full border border-[#fbddc3] rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3d2314]">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-[#fbddc3] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#3d2314] text-[#fbddc3] py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-[#3d2314]/60 text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520]">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
