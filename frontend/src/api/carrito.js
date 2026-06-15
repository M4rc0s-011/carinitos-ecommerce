import api from './index'

export const getCarrito = () =>
  api.get('/api/carrito').then((r) => r.data.data)

export const agregarItem = (producto_id, cantidad, mensaje, personalizacion) =>
  api.post('/api/carrito/items', { producto_id, cantidad, mensaje, personalizacion }).then((r) => r.data.data)

export const actualizarCantidad = (item_id, cantidad) =>
  api.put(`/api/carrito/items/${item_id}`, { cantidad }).then((r) => r.data.data)

export const eliminarItem = (item_id) =>
  api.delete(`/api/carrito/items/${item_id}`).then((r) => r.data.data)

export const vaciarCarrito = () =>
  api.delete('/api/carrito').then((r) => r.data.data)
