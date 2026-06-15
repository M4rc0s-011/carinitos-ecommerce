const pool = require('../config/db')

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id, nombre, email, password, rol, email_verificado FROM usuarios WHERE email = ?',
    [email]
  )
  return rows[0] ?? null
}

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
    [id]
  )
  return rows[0] ?? null
}

const create = async ({ nombre, email, password, token_verificacion, token_verificacion_expira }) => {
  const [result] = await pool.execute(
    `INSERT INTO usuarios
       (nombre, email, password, rol, email_verificado, token_verificacion, token_verificacion_expira)
     VALUES (?, ?, ?, 'usuario', 0, ?, ?)`,
    [nombre, email, password, token_verificacion, token_verificacion_expira]
  )
  return result.insertId
}

const findByToken = async (token) => {
  const [rows] = await pool.execute(
    'SELECT id, email_verificado, token_verificacion_expira FROM usuarios WHERE token_verificacion = ? AND token_verificacion_expira > NOW()',
    [token]
  )
  return rows[0] ?? null
}

const marcarVerificado = async (id) => {
  await pool.execute(
    'UPDATE usuarios SET email_verificado = 1 WHERE id = ?',
    [id]
  )
}

const deleteById = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM usuarios WHERE id = ? AND rol != 'admin'",
    [id]
  )
  return result.affectedRows
}

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
  )
  return rows
}

module.exports = { findByEmail, findById, create, findByToken, marcarVerificado, findAll, deleteById }
