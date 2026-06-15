const rateLimit = require('express-rate-limit')

const makeHandler = (message) => (req, res) =>
  res.status(429).json({ ok: false, error: message })

const skipInTest = () => process.env.NODE_ENV === 'test'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler('Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.'),
})

const registroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler('Demasiados registros desde esta IP. Intenta de nuevo en una hora.'),
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler('Demasiadas peticiones. Intenta más tarde.'),
})

module.exports = { loginLimiter, registroLimiter, apiLimiter }
