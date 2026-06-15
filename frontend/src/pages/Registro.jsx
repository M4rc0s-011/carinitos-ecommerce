import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, X, Eye, EyeOff } from 'lucide-react'
import { registro as apiRegistro } from '../api/auth'

const TERMINOS_TEXTO =
  'Al registrarte aceptas que tus datos serán usados únicamente para gestionar ' +
  'tus pedidos en Cariñitos by Jossy. No compartimos tu información con terceros.'

function ModalTerminos({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#3d2314]">Términos y condiciones</h2>
          <button onClick={onClose} className="text-[#3d2314]/40 hover:text-[#3d2314] transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-[#3d2314]/70 leading-relaxed">{TERMINOS_TEXTO}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#3d2314] text-[#fbddc3] py-2.5 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-0.5">{msg}</p>
}

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [terminos, setTerminos] = useState(false)
  const [modalTerminos, setModalTerminos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [errorServidor, setErrorServidor] = useState(null)
  const [registrado, setRegistrado] = useState(false)

  function validar() {
    const e = {}
    if (nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido'
    if (password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (confirmar !== password) e.confirmar = 'Las contraseñas no coinciden'
    if (!terminos) e.terminos = 'Debes aceptar los términos'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    setErrors({})
    setLoading(true)
    setErrorServidor(null)
    try {
      await apiRegistro({ nombre: nombre.trim(), email, password })
      setRegistrado(true)
    } catch (err) {
      setErrorServidor(err.response?.data?.error ?? 'Error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  if (registrado) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#fbddc3]/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#3d2314]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-[#3d2314]">Revisa tu email</h1>
          <p className="text-sm text-[#3d2314]/60 max-w-xs leading-relaxed">
            Te enviamos un enlace de verificación. Ábrelo para activar tu cuenta antes de iniciar sesión.
          </p>
          <Link
            to="/login"
            className="text-sm text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520] transition-colors mt-2"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {modalTerminos && <ModalTerminos onClose={() => setModalTerminos(false)} />}

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl text-[#3d2314] text-center mb-2">
            Crear cuenta
          </h1>
          <p className="text-sm text-[#3d2314]/60 text-center mb-8">
            Únete a Cariñitos by Jossy
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3d2314]">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors ${
                  errors.nombre ? 'border-red-400 focus:border-red-400' : 'border-[#fbddc3] focus:border-[#3d2314]'
                }`}
              />
              <FieldError msg={errors.nombre} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3d2314]">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@email.com"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-400 focus:border-red-400' : 'border-[#fbddc3] focus:border-[#3d2314]'
                }`}
              />
              <FieldError msg={errors.email} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3d2314]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors ${
                    errors.password ? 'border-red-400 focus:border-red-400' : 'border-[#fbddc3] focus:border-[#3d2314]'
                  }`}
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
              <FieldError msg={errors.password} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3d2314]">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none transition-colors ${
                    errors.confirmar ? 'border-red-400 focus:border-red-400' : 'border-[#fbddc3] focus:border-[#3d2314]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d2314]/40 hover:text-[#3d2314] transition-colors"
                  aria-label={showConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError msg={errors.confirmar} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={terminos}
                  onChange={(e) => setTerminos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#3d2314] cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-[#3d2314]/70">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setModalTerminos(true)}
                    className="text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520]"
                  >
                    términos y condiciones
                  </button>
                </span>
              </label>
              <FieldError msg={errors.terminos} />
            </div>

            {errorServidor && (
              <p className="text-sm text-red-500 text-center">{errorServidor}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#3d2314] text-[#fbddc3] py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-sm text-[#3d2314]/60 text-center mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
