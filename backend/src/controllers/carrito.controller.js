const Carrito = require('../models/carrito.model')

const getCarrito = async (req, res) => {
  try {
    const carrito_id = await Carrito.getOrCreate(req.usuario.id)
    const items = await Carrito.getCarritoCompleto(req.usuario.id)
    return res.json({ ok: true, data: { carrito_id, items } })
  } catch (err) {
    console.error('[getCarrito]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const agregarItem = async (req, res) => {
  try {
    const { producto_id, cantidad, mensaje, personalizacion } = req.body
    const carrito_id = await Carrito.getOrCreate(req.usuario.id)
    await Carrito.agregarItem(carrito_id, { producto_id, cantidad: cantidad ?? 1, mensaje, personalizacion })
    const items = await Carrito.getCarritoCompleto(req.usuario.id)
    return res.json({ ok: true, data: { carrito_id, items } })
  } catch (err) {
    console.error('[agregarItem carrito]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const actualizarCantidad = async (req, res) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body
    if (!cantidad || cantidad < 1 || cantidad > 10) {
      return res.status(400).json({ ok: false, error: 'Cantidad inválida' })
    }
    const carrito_id = await Carrito.getOrCreate(req.usuario.id)
    await Carrito.actualizarItem(id, carrito_id, cantidad)
    const items = await Carrito.getCarritoCompleto(req.usuario.id)
    return res.json({ ok: true, data: { carrito_id, items } })
  } catch (err) {
    console.error('[actualizarCantidad carrito]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const eliminarItem = async (req, res) => {
  try {
    const { id } = req.params
    const carrito_id = await Carrito.getOrCreate(req.usuario.id)
    await Carrito.eliminarItem(id, carrito_id)
    const items = await Carrito.getCarritoCompleto(req.usuario.id)
    return res.json({ ok: true, data: { carrito_id, items } })
  } catch (err) {
    console.error('[eliminarItem carrito]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const vaciarCarrito = async (req, res) => {
  try {
    const carrito_id = await Carrito.getOrCreate(req.usuario.id)
    await Carrito.vaciarCarrito(carrito_id)
    return res.json({ ok: true, data: { carrito_id, items: [] } })
  } catch (err) {
    console.error('[vaciarCarrito]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

module.exports = { getCarrito, agregarItem, actualizarCantidad, eliminarItem, vaciarCarrito }
