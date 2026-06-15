const { body, validationResult } = require('express-validator')

const manejarErrores = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    const primero = errores.array()[0]
    return res.status(400).json({ ok: false, error: primero.msg })
  }
  next()
}

const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  manejarErrores,
]

const validarLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  manejarErrores,
]

module.exports = { validarRegistro, validarLogin }
