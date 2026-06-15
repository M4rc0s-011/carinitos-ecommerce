const pool = require('../../../config/db')
const bcrypt = require('bcryptjs')

async function crearUsuario({ nombre, email, password = 'test1234', verificado = false }) {
  const hash = await bcrypt.hash(password, 10)
  const [result] = await pool.execute(
    `INSERT INTO usuarios (nombre, email, password, rol, email_verificado, token_verificacion, token_verificacion_expira)
     VALUES (?, ?, ?, 'usuario', ?, NULL, NULL)`,
    [nombre, email, hash, verificado ? 1 : 0]
  )
  return { id: result.insertId, email, password }
}

async function limpiarUsuario(id) {
  await pool.execute(
    'DELETE FROM pedido_items WHERE pedido_id IN (SELECT id FROM pedidos WHERE usuario_id = ?)',
    [id]
  )
  await pool.execute('DELETE FROM pedidos WHERE usuario_id = ?', [id])
  await pool.execute(
    'DELETE FROM carrito_items WHERE carrito_id IN (SELECT id FROM carrito WHERE usuario_id = ?)',
    [id]
  )
  await pool.execute('DELETE FROM carrito WHERE usuario_id = ?', [id])
  await pool.execute('DELETE FROM usuarios WHERE id = ?', [id])
}

async function crearProducto({ nombre = 'Producto Test', precio = 500, stock = 1 } = {}) {
  const [result] = await pool.execute(
    'INSERT INTO productos (nombre, precio, stock, activo) VALUES (?, ?, ?, 1)',
    [nombre, precio, stock]
  )
  return { id: result.insertId }
}

async function limpiarProducto(id) {
  await pool.execute('DELETE FROM pedido_items WHERE producto_id = ?', [id])
  await pool.execute('DELETE FROM productos WHERE id = ?', [id])
}

module.exports = { crearUsuario, limpiarUsuario, crearProducto, limpiarProducto }
