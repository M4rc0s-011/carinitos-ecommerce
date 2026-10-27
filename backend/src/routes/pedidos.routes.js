const { Router } = require('express')
const ctrl = require('../controllers/pedidos.controller')
const { verificarToken, tokenOpcional, soloAdmin } = require('../middlewares/auth.middleware')
const { pedidoLimiter } = require('../middlewares/rateLimit.middleware')

const router = Router()

// /mis-pedidos ANTES de /:id para que Express no lo trate como ID
router.get('/mis-pedidos', verificarToken, ctrl.misPedidos)

// Sin verificarToken: compra como invitado. tokenOpcional asocia el pedido si hay sesión.
router.post('/',            pedidoLimiter, tokenOpcional, ctrl.crear)
router.get('/',             verificarToken, soloAdmin,  ctrl.listar)
router.get('/:id',          verificarToken,             ctrl.detalle)
router.put('/:id/estado',   verificarToken, soloAdmin,  ctrl.actualizarEstado)
router.delete('/:id',       verificarToken, soloAdmin,  ctrl.eliminar)

module.exports = router
