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

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ ok: false, error: 'Acceso denegado' })
  }
  next()
}

module.exports = { verificarToken, soloAdmin }
