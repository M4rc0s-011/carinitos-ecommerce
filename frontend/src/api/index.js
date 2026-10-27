import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Páginas públicas de auth: un token vencido no debe sacar al usuario de ellas.
const RUTAS_SIN_REDIRECCION = ['/login', '/registro', '/verificar-email']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('usuario')
      if (!RUTAS_SIN_REDIRECCION.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
