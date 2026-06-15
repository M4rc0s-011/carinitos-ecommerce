import api from './index'

export const getProductos = (filtros = {}) => {
  const params = {}
  if (filtros.busqueda)    params.busqueda    = filtros.busqueda
  if (filtros.categoria_id) params.categoria_id = filtros.categoria_id
  if (filtros.precio_min !== '' && filtros.precio_min !== undefined) params.precio_min = filtros.precio_min
  if (filtros.precio_max !== '' && filtros.precio_max !== undefined) params.precio_max = filtros.precio_max
  if (filtros.ordenar)     params.ordenar     = filtros.ordenar
  return api.get('/api/productos', { params }).then((r) => r.data.data)
}

export const getProducto = (id) =>
  api.get(`/api/productos/${id}`).then((r) => r.data.data)

export const getCategorias = () =>
  api.get('/api/categorias').then((r) => r.data.data)
