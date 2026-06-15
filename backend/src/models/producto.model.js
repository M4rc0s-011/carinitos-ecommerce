const pool = require('../config/db')

const ORDER_MAP = {
  precio_asc:  'p.precio ASC',
  precio_desc: 'p.precio DESC',
  vendidos:    'p.id DESC',   // placeholder hasta tener tabla de ventas
  recientes:   'p.created_at DESC',
}

const findAll = async ({ busqueda, categoria_id, precio_min, precio_max, ordenar } = {}) => {
  const conditions = ['p.activo = 1']
  const params = []

  if (busqueda) {
    conditions.push('p.nombre LIKE ?')
    params.push(`%${busqueda}%`)
  }
  if (categoria_id) {
    conditions.push('p.categoria_id = ?')
    params.push(Number(categoria_id))
  }
  if (precio_min !== undefined && precio_min !== '') {
    conditions.push('p.precio >= ?')
    params.push(Number(precio_min))
  }
  if (precio_max !== undefined && precio_max !== '') {
    conditions.push('p.precio <= ?')
    params.push(Number(precio_max))
  }

  const order = ORDER_MAP[ordenar] ?? ORDER_MAP.recientes
  const where = conditions.join(' AND ')

  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
            p.categoria_id, c.nombre AS categoria_nombre,
            p.stock, p.activo, p.created_at
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE ${where}
     ORDER BY ${order}`,
    params
  )
  return rows
}

const findById = async (id, { includeInactive = false } = {}) => {
  const activoClause = includeInactive ? '' : 'AND p.activo = 1'
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
            p.categoria_id, c.nombre AS categoria_nombre,
            p.stock, p.activo, p.created_at
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.id = ? ${activoClause}`,
    [id]
  )
  return rows[0] ?? null
}

const findAllAdmin = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
            p.categoria_id, c.nombre AS categoria_nombre,
            p.stock, p.activo, p.created_at
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     ORDER BY p.created_at DESC`
  )
  return rows
}

const create = async ({ nombre, descripcion, precio, imagen, categoria_id, stock }) => {
  const [result] = await pool.execute(
    `INSERT INTO productos (nombre, descripcion, precio, imagen, categoria_id, stock)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion ?? null, precio, imagen ?? null, categoria_id ?? null, stock ?? 0]
  )
  return result.insertId
}

const update = async (id, { nombre, descripcion, precio, imagen, categoria_id, stock }) => {
  await pool.execute(
    `UPDATE productos
     SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, categoria_id = ?, stock = ?
     WHERE id = ?`,
    [nombre, descripcion ?? null, precio, imagen ?? null, categoria_id ?? null, stock ?? 0, id]
  )
}

const desactivar = async (id) => {
  await pool.execute('UPDATE productos SET activo = 0 WHERE id = ?', [id])
}

const activate = async (id) => {
  await pool.execute('UPDATE productos SET activo = 1 WHERE id = ?', [id])
}

const findAllCategorias = async () => {
  const [rows] = await pool.execute('SELECT id, nombre FROM categorias ORDER BY nombre')
  return rows
}

const createCategoria = async (nombre) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nombre) VALUES (?)',
    [nombre]
  )
  return result.insertId
}

const updateCategoria = async (id, nombre) => {
  await pool.execute('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id])
}

const deleteCategoria = async (id) => {
  await pool.execute('DELETE FROM categorias WHERE id = ?', [id])
}

module.exports = { findAll, findById, findAllAdmin, create, update, desactivar, activate, findAllCategorias, createCategoria, updateCategoria, deleteCategoria }
