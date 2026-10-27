const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Token requerido' })
  }

  const token = auth.slice(7)
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ ok: false, error: 'Token inválido o expirado' })
  }
}

// Igual que verificarToken pero nunca bloquea: deja req.usuario si el token es
// válido y sigue adelante si falta o está vencido. Para rutas que sirven tanto a
// usuarios con sesión como a invitados.
const tokenOpcional = (req, res, next) => {
  const auth = req.headers['authorization']
  if (auth?.startsWith('Bearer ')) {
    try {
      req.usuario = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
    } catch {
      // Token viejo o inválido: se ignora y el pedido sigue como invitado.
    }
  }
  next()
}

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ ok: false, error: 'Acceso denegado' })
  }
  next()
}

module.exports = { verificarToken, tokenOpcional, soloAdmin }
