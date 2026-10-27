const { Router } = require('express')
const { registro, login, verificarEmail, reenviarVerificacion } = require('../controllers/auth.controller')
const { validarRegistro, validarLogin, validarReenvio } = require('../validators/auth.validators')
const { loginLimiter, registroLimiter, reenvioLimiter } = require('../middlewares/rateLimit.middleware')

const router = Router()

router.post('/registro',              registroLimiter, validarRegistro, registro)
router.post('/login',                 loginLimiter,    validarLogin,    login)
router.post('/reenviar-verificacion', reenvioLimiter,  validarReenvio,  reenviarVerificacion)
router.get('/verificar-email',                                          verificarEmail)

module.exports = router
