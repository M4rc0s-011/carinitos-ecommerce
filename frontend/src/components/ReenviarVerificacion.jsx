import { useState } from 'react'
import { Loader2, MailCheck } from 'lucide-react'
import { reenviarVerificacion } from '../api/auth'

export default function ReenviarVerificacion({ emailInicial = '' }) {
  const [email, setEmail] = useState(emailInicial)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const pedirEmail = emailInicial === ''

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)
    setError(null)
    try {
      const { mensaje: msg } = await reenviarVerificacion(email.trim())
      setMensaje(msg ?? 'Listo, revisa tu bandeja de entrada.')
    } catch (err) {
      setError(err.response?.data?.error ?? 'No pudimos enviar el email. Intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  if (mensaje) {
    return (
      <div className="w-full flex items-start gap-2.5 bg-[#fbddc3]/40 border border-[#fbddc3] rounded-xl px-4 py-3 text-sm text-[#3d2314] text-left">
        <MailCheck size={16} className="flex-shrink-0 mt-0.5" />
        <span>{mensaje}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      {pedirEmail && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tucorreo@email.com"
          className="w-full border border-[#fbddc3] rounded-xl px-4 py-2.5 text-sm text-[#3d2314] placeholder-[#3d2314]/30 focus:outline-none focus:border-[#3d2314] transition-colors"
        />
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading || email.trim() === ''}
        className="w-full flex items-center justify-center gap-2 border border-[#3d2314] text-[#3d2314] py-2.5 rounded-full text-sm font-medium hover:bg-[#3d2314] hover:text-[#fbddc3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? 'Enviando...' : 'Reenviar enlace de verificación'}
      </button>
    </form>
  )
}
