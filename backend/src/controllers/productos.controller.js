const Producto = require('../models/producto.model')
const cloudinary = require('../config/cloudinary')
const { subirACloudinary } = require('../middlewares/upload.middleware')

const listar = async (req, res) => {
  try {
    const { busqueda, categoria_id, precio_min, precio_max, ordenar } = req.query
    const productos = await Producto.findAll({ busqueda, categoria_id, precio_min, precio_max, ordenar })
    return res.json({ ok: true, data: productos })
  } catch (err) {
    console.error('[listar productos]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const detalle = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' })
    }
    return res.json({ ok: true, data: producto })
  } catch (err) {
    console.error('[detalle producto]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const crear = async (req, res) => {
  try {
    let imagen = req.body.imagen ?? null
    if (req.file) {
      const result = await subirACloudinary(req.file.buffer, req.file.mimetype)
      imagen = result.secure_url
    }
    const { nombre, descripcion, precio, categoria_id, stock } = req.body
    const id = await Producto.create({ nombre, descripcion, precio, imagen, categoria_id, stock })
    const producto = await Producto.findById(id)
    return res.status(201).json({ ok: true, data: producto })
  } catch (err) {
    console.error('[crear producto]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const editar = async (req, res) => {
  try {
    const { id } = req.params
    const existe = await Producto.findById(id, { includeInactive: true })
    if (!existe) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' })
    }

    let imagen
    if (req.file) {
      if (existe.imagen && existe.imagen.includes('res.cloudinary.com')) {
        const match = existe.imagen.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
        if (match) await cloudinary.uploader.destroy(match[1]).catch(() => {})
      }
      const result = await subirACloudinary(req.file.buffer, req.file.mimetype)
      imagen = result.secure_url
    } else if ('imagen' in req.body) {
      imagen = req.body.imagen || null
    } else {
      imagen = existe.imagen
    }

    const { nombre, descripcion, precio, categoria_id, stock } = req.body
    await Producto.update(id, { nombre, descripcion, precio, imagen, categoria_id, stock })
    const actualizado = await Producto.findById(id, { includeInactive: true })
    return res.json({ ok: true, data: actualizado })
  } catch (err) {
    console.error('[editar producto]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const desactivar = async (req, res) => {
  try {
    const { id } = req.params
    const existe = await Producto.findById(id)
    if (!existe) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' })
    }
    await Producto.desactivar(id)
    return res.json({ ok: true, data: { id: Number(id) } })
  } catch (err) {
    console.error('[desactivar producto]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const listarAdmin = async (req, res) => {
  try {
    const productos = await Producto.findAllAdmin()
    return res.json({ ok: true, data: productos })
  } catch (err) {
    console.error('[listar admin productos]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const activar = async (req, res) => {
  try {
    const { id } = req.params
    const existe = await Producto.findById(id, { includeInactive: true })
    if (!existe) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' })
    }
    await Producto.activate(id)
    return res.json({ ok: true, data: { id: Number(id), activo: true } })
  } catch (err) {
    console.error('[activar producto]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Producto.findAllCategorias()
    return res.json({ ok: true, data: categorias })
  } catch (err) {
    console.error('[listar categorias]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body
    const id = await Producto.createCategoria(nombre)
    return res.status(201).json({ ok: true, data: { id, nombre } })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: 'La categoría ya existe' })
    }
    console.error('[crear categoria]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const editarCategoria = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body
    if (!nombre?.trim()) {
      return res.status(400).json({ ok: false, error: 'El nombre es obligatorio' })
    }
    await Producto.updateCategoria(id, nombre.trim())
    return res.json({ ok: true, data: { id: Number(id), nombre: nombre.trim() } })
  } catch (err) {
    console.error('[editar categoria]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params
    await Producto.deleteCategoria(id)
    return res.json({ ok: true, data: { id: Number(id) } })
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ ok: false, error: 'La categoría tiene productos asociados' })
    }
    console.error('[eliminar categoria]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

module.exports = { listar, detalle, crear, editar, desactivar, listarAdmin, activar, listarCategorias, crearCategoria, editarCategoria, eliminarCategoria }
