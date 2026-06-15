const { Router } = require('express')
const { registro, login, verificarEmail } = require('../controllers/auth.controller')
const { validarRegistro, validarLogin } = require('../validators/auth.validators')
const { loginLimiter, registroLimiter } = require('../middlewares/rateLimit.middleware')

const router = Router()

router.post('/registro',         registroLimiter, validarRegistro, registro)
router.post('/login',            loginLimiter,    validarLogin,    login)
router.get('/verificar-email',                    verificarEmail)

module.exports = router
