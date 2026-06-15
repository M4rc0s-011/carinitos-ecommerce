import api from './index'

export const crearPedido = (data) =>
  api.post('/api/pedidos', data).then((r) => r.data.data)

export const getMisPedidos = () =>
  api.get('/api/pedidos/mis-pedidos').then((r) => r.data.data)

export const getPedido = (id) =>
  api.get(`/api/pedidos/${id}`).then((r) => r.data.data)
