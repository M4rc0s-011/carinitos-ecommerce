const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const firmarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const verificarToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET)

const generarTokenVerificacion = () =>
  crypto.randomBytes(32).toString('hex')

module.exports = { firmarToken, verificarToken, generarTokenVerificacion }
