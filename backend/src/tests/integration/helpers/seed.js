const pool = require('../../../config/db')
const bcrypt = require('bcryptjs')

async function crearUsuario({
  nombre,
  email,
  password = 'test1234',
  verificado = false,
  token = null,
  tokenExpiraEn = 24 * 60 * 60 * 1000,
}) {
  const hash = await bcrypt.hash(password, 10)
  const expira = token ? new Date(Date.now() + tokenExpiraEn) : null
  const [result] = await pool.execute(
    `INSERT INTO usuarios (nombre, email, password, rol, email_verificado, token_verificacion, token_verificacion_expira)
     VALUES (?, ?, ?, 'usuario', ?, ?, ?)`,
    [nombre, email, hash, verificado ? 1 : 0, token, expira]
  )
  return { id: result.insertId, email, password, token }
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

async function limpiarPedido(id) {
  await pool.execute('DELETE FROM pedido_items WHERE pedido_id = ?', [id])
  await pool.execute('DELETE FROM pedidos WHERE id = ?', [id])
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

module.exports = { crearUsuario, limpiarUsuario, limpiarPedido, crearProducto, limpiarProducto }
