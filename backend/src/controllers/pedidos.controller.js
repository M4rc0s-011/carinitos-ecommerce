const Pedido  = require('../models/pedido.model')
const Producto = require('../models/producto.model')
const { calcularSubtotal, calcularAdelanto, calcularTotalConEnvio } = require('../utils/carrito.utils')

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'completado', 'cancelado']
const COSTO_ENVIO = 250

const crear = async (req, res) => {
  try {
    const { tipo_envio, items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'El pedido debe tener al menos un producto' })
    }

    // Validar productos y construir snapshot
    const itemsEnriquecidos = []
    for (const item of items) {
      if (!item.producto_id || !item.cantidad || item.cantidad < 1) {
        return res.status(400).json({ ok: false, error: 'Cada item requiere producto_id y cantidad >= 1' })
      }
      const producto = await Producto.findById(item.producto_id)
      if (!producto) {
        return res.status(400).json({ ok: false, error: `Producto ${item.producto_id} no encontrado o inactivo` })
      }
      itemsEnriquecidos.push({
        producto_id:     item.producto_id,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio,
        cantidad:        item.cantidad,
        mensaje:         item.mensaje ?? null,
        personalizacion: item.personalizacion ?? null,
      })
    }

    const subtotal = calcularSubtotal(itemsEnriquecidos)
    const total    = calcularTotalConEnvio(subtotal, COSTO_ENVIO)
    const adelanto = calcularAdelanto(total)

    const pedido_id = await Pedido.create({
      usuario_id: req.usuario.id,
      tipo_envio: tipo_envio ?? null,
      total,
      adelanto,
      items: itemsEnriquecidos,
    })

    const pedido = await Pedido.findById(pedido_id)
    return res.status(201).json({ ok: true, data: pedido })
  } catch (err) {
    console.error('[crear pedido]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const listar = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll()
    return res.json({ ok: true, data: pedidos })
  } catch (err) {
    console.error('[listar pedidos]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const misPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findByUsuario(req.usuario.id)
    return res.json({ ok: true, data: pedidos })
  } catch (err) {
    console.error('[mis pedidos]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const detalle = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' })
    }
    if (req.usuario.rol !== 'admin' && pedido.usuario_id !== req.usuario.id) {
      return res.status(403).json({ ok: false, error: 'Acceso denegado' })
    }
    return res.json({ ok: true, data: pedido })
  } catch (err) {
    console.error('[detalle pedido]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        ok: false,
        error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`,
      })
    }
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' })
    }
    await Pedido.updateEstado(req.params.id, estado)
    return res.json({ ok: true, data: { id: Number(req.params.id), estado } })
  } catch (err) {
    console.error('[actualizar estado]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const eliminar = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' })
    }
    await Pedido.deleteById(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    console.error('[eliminar pedido]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

module.exports = { crear, listar, misPedidos, detalle, actualizarEstado, eliminar }
