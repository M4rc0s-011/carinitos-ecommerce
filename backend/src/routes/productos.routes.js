const { Router } = require('express')
const ctrl = require('../controllers/productos.controller')
const { validarProducto } = require('../validators/productos.validators')
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware')
const { uploadSingle } = require('../middlewares/upload.middleware')

const router = Router()

router.get('/admin',   verificarToken, soloAdmin, ctrl.listarAdmin)
router.get('/',        ctrl.listar)
router.get('/:id',     ctrl.detalle)
router.post('/',       verificarToken, soloAdmin, uploadSingle, validarProducto, ctrl.crear)
router.put('/:id',     verificarToken, soloAdmin, uploadSingle, validarProducto, ctrl.editar)
router.patch('/:id/activo', verificarToken, soloAdmin, ctrl.activar)
router.delete('/:id',  verificarToken, soloAdmin, ctrl.desactivar)

module.exports = router
