import api from './index'

export const getProductosAdmin    = () => api.get('/api/productos/admin').then((r) => r.data.data)
export const createProducto       = (data) => api.post('/api/productos', data).then((r) => r.data.data)
export const updateProducto       = (id, data) => api.put(`/api/productos/${id}`, data).then((r) => r.data.data)
export const deleteProducto       = (id) => api.delete(`/api/productos/${id}`).then((r) => r.data)
export const activarProducto      = (id) => api.patch(`/api/productos/${id}/activo`).then((r) => r.data.data)

export const getPedidosAdmin      = () => api.get('/api/pedidos').then((r) => r.data.data)
export const getPedidoAdmin       = (id) => api.get(`/api/pedidos/${id}`).then((r) => r.data.data)
export const updateEstadoPedido   = (id, estado) => api.put(`/api/pedidos/${id}/estado`, { estado }).then((r) => r.data.data)
export const deletePedidoAdmin    = (id) => api.delete(`/api/pedidos/${id}`).then((r) => r.data)

export const getCategorias        = () => api.get('/api/categorias').then((r) => r.data.data)
export const createCategoria      = (nombre) => api.post('/api/categorias', { nombre }).then((r) => r.data.data)
export const updateCategoria      = (id, nombre) => api.put(`/api/categorias/${id}`, { nombre }).then((r) => r.data.data)
export const deleteCategoria      = (id) => api.delete(`/api/categorias/${id}`).then((r) => r.data)

export const getUsuarios          = () => api.get('/api/usuarios').then((r) => r.data.data)
export const limpiarUsuarios      = () => api.delete('/api/usuarios/limpiar').then((r) => r.data.data)
export const deleteUsuario        = (id) => api.delete(`/api/usuarios/${id}`).then((r) => r.data)
