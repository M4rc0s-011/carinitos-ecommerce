const pool = require('../config/db')

const create = async ({ usuario_id, tipo_envio, total, adelanto, items }) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [pedidoResult] = await conn.execute(
      `INSERT INTO pedidos (usuario_id, tipo_envio, total, adelanto, estado)
       VALUES (?, ?, ?, ?, 'pendiente')`,
      [usuario_id, tipo_envio ?? null, total, adelanto]
    )
    const pedido_id = pedidoResult.insertId

    for (const item of items) {
      await conn.execute(
        `INSERT INTO pedido_items
           (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, mensaje, personalizacion)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pedido_id,
          item.producto_id,
          item.nombre_producto,
          item.precio_unitario,
          item.cantidad,
          item.mensaje ?? null,
          item.personalizacion ?? null,
        ]
      )
    }

    // Vaciar carrito del usuario
    await conn.execute(
      `DELETE ci FROM carrito_items ci
       INNER JOIN carrito c ON c.id = ci.carrito_id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    )

    await conn.commit()
    return pedido_id
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.usuario_id, u.nombre AS usuario_nombre, u.email AS usuario_email,
            p.tipo_envio, p.total, p.adelanto, p.estado, p.created_at
     FROM pedidos p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     ORDER BY p.created_at DESC`
  )
  return rows
}

const findByUsuario = async (usuario_id) => {
  const [rows] = await pool.execute(
    `SELECT id, tipo_envio, total, adelanto, estado, created_at
     FROM pedidos
     WHERE usuario_id = ?
     ORDER BY created_at DESC`,
    [usuario_id]
  )
  return rows
}

const findById = async (id) => {
  const [pedidos] = await pool.execute(
    `SELECT p.id, p.usuario_id, u.nombre AS usuario_nombre, u.email AS usuario_email,
            p.tipo_envio, p.total, p.adelanto, p.estado, p.created_at
     FROM pedidos p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     WHERE p.id = ?`,
    [id]
  )
  if (!pedidos[0]) return null

  const [items] = await pool.execute(
    `SELECT id, producto_id, nombre_producto, precio_unitario, cantidad, mensaje, personalizacion
     FROM pedido_items
     WHERE pedido_id = ?`,
    [id]
  )

  return { ...pedidos[0], items }
}

const updateEstado = async (id, estado) => {
  await pool.execute('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id])
}

const deleteById = async (id) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.execute('DELETE FROM pedido_items WHERE pedido_id = ?', [id])
    await conn.execute('DELETE FROM pedidos WHERE id = ?', [id])
    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

module.exports = { create, findAll, findByUsuario, findById, updateEstado, deleteById }
