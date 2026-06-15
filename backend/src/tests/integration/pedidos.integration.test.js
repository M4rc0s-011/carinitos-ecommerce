const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const { crearUsuario, limpiarUsuario, crearProducto, limpiarProducto } = require('./helpers/seed')
const teardown = require('./helpers/teardown')

let usuario, producto, token

beforeAll(async () => {
  usuario = await crearUsuario({
    nombre: 'Test Pedido',
    email: `pedido-${Date.now()}@test.com`,
    password: 'test1234',
    verificado: true,
  })
  producto = await crearProducto()
  token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: 'usuario' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
})

afterAll(async () => {
  await limpiarProducto(producto.id)
  await limpiarUsuario(usuario.id)
  await teardown()
})

describe('POST /api/pedidos', () => {
  it('401 sin token', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({ tipo_envio: 'santo_domingo', items: [{ producto_id: 1, cantidad: 1 }] })
    expect(res.status).toBe(401)
  })

  it('400 con items vacíos', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({ tipo_envio: 'santo_domingo', items: [] })
    expect(res.status).toBe(400)
  })

  it('201 con pedido válido', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo_envio: 'santo_domingo',
        items: [{ producto_id: producto.id, cantidad: 1, mensaje: 'Test', personalizacion: 'Base azul' }],
      })
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
  })
})
