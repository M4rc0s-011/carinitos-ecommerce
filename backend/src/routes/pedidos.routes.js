const { Router } = require('express')
const ctrl = require('../controllers/pedidos.controller')
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware')

const router = Router()

// /mis-pedidos ANTES de /:id para que Express no lo trate como ID
router.get('/mis-pedidos', verificarToken, ctrl.misPedidos)

router.post('/',            verificarToken,             ctrl.crear)
router.get('/',             verificarToken, soloAdmin,  ctrl.listar)
router.get('/:id',          verificarToken,             ctrl.detalle)
router.put('/:id/estado',   verificarToken, soloAdmin,  ctrl.actualizarEstado)
router.delete('/:id',       verificarToken, soloAdmin,  ctrl.eliminar)

module.exports = router
