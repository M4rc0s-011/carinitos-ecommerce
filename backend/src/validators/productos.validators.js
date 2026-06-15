const { body, validationResult } = require('express-validator')

const manejarErrores = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    const primero = errores.array()[0]
    return res.status(400).json({ ok: false, error: primero.msg })
  }
  next()
}

const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('stock')
    .isInt({ min: 0 }).withMessage('El stock debe ser 0 o mayor'),
  body('categoria_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('categoria_id debe ser un entero positivo'),
  manejarErrores,
]

const validarCategoria = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio'),
  manejarErrores,
]

module.exports = { validarProducto, validarCategoria }
