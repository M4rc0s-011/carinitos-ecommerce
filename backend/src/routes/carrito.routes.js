const { Router } = require('express')
const ctrl = require('../controllers/carrito.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

const router = Router()

router.get('/',           verificarToken, ctrl.getCarrito)
router.post('/items',     verificarToken, ctrl.agregarItem)
router.put('/items/:id',  verificarToken, ctrl.actualizarCantidad)
router.delete('/items/:id', verificarToken, ctrl.eliminarItem)
router.delete('/',        verificarToken, ctrl.vaciarCarrito)

module.exports = router
