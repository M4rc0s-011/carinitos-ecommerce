import api from './index'

export const login = (data) =>
  api.post('/api/auth/login', data).then((r) => r.data)

export const registro = (data) =>
  api.post('/api/auth/registro', data).then((r) => r.data)

export const verificarEmail = (token) =>
  api.get(`/api/auth/verificar-email?token=${token}`).then((r) => r.data)
