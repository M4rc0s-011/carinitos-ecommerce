import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function getStorage(rol) {
  return rol === 'admin' ? sessionStorage : localStorage
}

function readStoredAuth() {
  for (const storage of [sessionStorage, localStorage]) {
    const t = storage.getItem('token')
    const u = storage.getItem('usuario')
    if (t && u) {
      try { return { token: t, usuario: JSON.parse(u) } }
      catch { storage.removeItem('token'); storage.removeItem('usuario') }
    }
  }
  return { token: null, usuario: null }
}

export function AuthProvider({ children }) {
  const init = readStoredAuth()
  const [usuario, setUsuario] = useState(init.usuario)
  const [token, setToken] = useState(init.token)
  const loading = false

  function login(tokenValue, usuarioValue) {
    const storage = getStorage(usuarioValue.rol)
    storage.setItem('token', tokenValue)
    storage.setItem('usuario', JSON.stringify(usuarioValue))
    setToken(tokenValue)
    setUsuario(usuarioValue)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  function isAdmin() {
    return usuario?.rol === 'admin'
  }

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
