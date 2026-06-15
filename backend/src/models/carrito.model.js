const pool = require('../config/db')

const getOrCreate = async (usuario_id) => {
  const [rows] = await pool.execute(
    'SELECT id FROM carrito WHERE usuario_id = ?',
    [usuario_id]
  )
  if (rows[0]) return rows[0].id

  const [result] = await pool.execute(
    'INSERT INTO carrito (usuario_id) VALUES (?)',
    [usuario_id]
  )
  return result.insertId
}

const getCarritoCompleto = async (usuario_id) => {
  const [rows] = await pool.execute(
    `SELECT ci.id AS item_id, ci.producto_id, ci.cantidad, ci.mensaje, ci.personalizacion,
            p.nombre, p.precio, p.imagen
     FROM carrito c
     JOIN carrito_items ci ON ci.carrito_id = c.id
     JOIN productos p ON p.id = ci.producto_id
     WHERE c.usuario_id = ?
     ORDER BY ci.id ASC`,
    [usuario_id]
  )
  return rows
}

const agregarItem = async (carrito_id, { producto_id, cantidad, mensaje, personalizacion }) => {
  const [rows] = await pool.execute(
    `SELECT id, cantidad FROM carrito_items
     WHERE carrito_id = ? AND producto_id = ? AND mensaje = ? AND personalizacion = ?`,
    [carrito_id, producto_id, mensaje ?? '', personalizacion ?? '']
  )
  if (rows[0]) {
    const nuevaCantidad = Math.min(10, rows[0].cantidad + cantidad)
    await pool.execute(
      'UPDATE carrito_items SET cantidad = ? WHERE id = ?',
      [nuevaCantidad, rows[0].id]
    )
  } else {
    await pool.execute(
      `INSERT INTO carrito_items (carrito_id, producto_id, cantidad, mensaje, personalizacion)
       VALUES (?, ?, ?, ?, ?)`,
      [carrito_id, producto_id, cantidad, mensaje ?? '', personalizacion ?? '']
    )
  }
}

const actualizarItem = async (item_id, carrito_id, cantidad) => {
  await pool.execute(
    'UPDATE carrito_items SET cantidad = ? WHERE id = ? AND carrito_id = ?',
    [cantidad, item_id, carrito_id]
  )
}

const eliminarItem = async (item_id, carrito_id) => {
  await pool.execute(
    'DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?',
    [item_id, carrito_id]
  )
}

const vaciarCarrito = async (carrito_id) => {
  await pool.execute(
    'DELETE FROM carrito_items WHERE carrito_id = ?',
    [carrito_id]
  )
}

module.exports = { getOrCreate, getCarritoCompleto, agregarItem, actualizarItem, eliminarItem, vaciarCarrito }
