const { Router } = require('express')
const { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/productos.controller')
const { validarCategoria } = require('../validators/productos.validators')
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware')

const router = Router()

router.get('/',     listarCategorias)
router.post('/',    validarCategoria, verificarToken, soloAdmin, crearCategoria)
router.put('/:id',  verificarToken, soloAdmin, editarCategoria)
router.delete('/:id', verificarToken, soloAdmin, eliminarCategoria)

module.exports = router
