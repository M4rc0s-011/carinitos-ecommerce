import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RutaAdmin({ children }) {
  const { token, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={28} className="animate-spin text-[#3d2314]/40" />
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/" replace />

  return children
}
