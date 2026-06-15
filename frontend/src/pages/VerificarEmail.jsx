import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { verificarEmail } from '../api/auth'

export default function VerificarEmail() {
  const [params] = useSearchParams()
  const [estado, setEstado] = useState('verificando')
  const [errorMsg, setErrorMsg] = useState('')
  const llamado = useRef(false)

  useEffect(() => {
    if (llamado.current) return
    llamado.current = true

    const token = params.get('token')
    if (!token) {
      setEstado('error')
      setErrorMsg('No se encontró el token de verificación.')
      return
    }
    verificarEmail(token)
      .then(() => setEstado('exito'))
      .catch((err) => {
        setEstado('error')
        setErrorMsg(err.response?.data?.error ?? 'Token inválido o expirado.')
      })
  }, [])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-4">
        {estado === 'verificando' && (
          <>
            <Loader2 size={32} className="animate-spin text-[#3d2314]/40" />
            <p className="text-sm text-[#3d2314]/60">Verificando tu cuenta...</p>
          </>
        )}

        {estado === 'exito' && (
          <>
            <CheckCircle size={44} className="text-green-500" />
            <h1 className="font-display text-3xl text-[#3d2314]">¡Cuenta verificada!</h1>
            <p className="text-sm text-[#3d2314]/60">Ya puedes iniciar sesión.</p>
            <Link
              to="/login?verificado=true"
              className="inline-block bg-[#3d2314] text-[#fbddc3] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#5a3520] transition-colors mt-2"
            >
              Iniciar sesión
            </Link>
          </>
        )}

        {estado === 'error' && (
          <>
            <XCircle size={44} className="text-red-400" />
            <h1 className="font-display text-3xl text-[#3d2314]">Enlace inválido</h1>
            <p className="text-sm text-[#3d2314]/60">{errorMsg}</p>
            <Link
              to="/registro"
              className="text-sm text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520] transition-colors"
            >
              Volver al registro
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
