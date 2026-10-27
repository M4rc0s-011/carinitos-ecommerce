const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const pool = require('../../config/db')
const { crearUsuario, limpiarUsuario, limpiarPedido, crearProducto, limpiarProducto } = require('./helpers/seed')
const teardown = require('./helpers/teardown')

let usuario, producto, token, tokenAdmin
const pedidosCreados = []

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
  tokenAdmin = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
})

afterAll(async () => {
  for (const id of pedidosCreados) await limpiarPedido(id)
  await limpiarProducto(producto.id)
  await limpiarUsuario(usuario.id)
  await teardown()
})

describe('POST /api/pedidos', () => {
  it('400 sin token y sin nombre', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({
        tipo_envio: 'santo_domingo',
        telefono: '809-555-1234',
        items: [{ producto_id: producto.id, cantidad: 1 }],
      })
    expect(res.status).toBe(400)
  })

  it('400 sin token y sin teléfono', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({
        tipo_envio: 'santo_domingo',
        nombre: 'María Invitada',
        items: [{ producto_id: producto.id, cantidad: 1 }],
      })
    expect(res.status).toBe(400)
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
    expect(res.body.data.usuario_id).toBe(usuario.id)
    pedidosCreados.push(res.body.data.id)
  })

  it('201 como invitado: guarda contacto y deja usuario_id en NULL', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({
        tipo_envio: 'santo_domingo',
        nombre: '  María Invitada  ',
        telefono: '  809-555-1234  ',
        items: [{ producto_id: producto.id, cantidad: 2 }],
      })

    expect(res.status).toBe(201)
    pedidosCreados.push(res.body.data.id)

    const [rows] = await pool.execute(
      'SELECT usuario_id, invitado_nombre, invitado_telefono FROM pedidos WHERE id = ?',
      [res.body.data.id]
    )
    expect(rows[0].usuario_id).toBeNull()
    expect(rows[0].invitado_nombre).toBe('María Invitada')
    expect(rows[0].invitado_telefono).toBe('809-555-1234')
  })

  it('un token vencido no tumba la compra: pasa como invitado', async () => {
    const vencido = jwt.sign(
      { id: usuario.id, rol: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' }
    )
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${vencido}`)
      .send({
        tipo_envio: 'santo_domingo',
        nombre: 'Token Vencido',
        telefono: '809-555-9999',
        items: [{ producto_id: producto.id, cantidad: 1 }],
      })

    expect(res.status).toBe(201)
    expect(res.body.data.usuario_id).toBeNull()
    pedidosCreados.push(res.body.data.id)
  })

  it('el envío al interior cuesta 300 y el de Santo Domingo 250', async () => {
    const base = {
      nombre: 'Costo Envio',
      telefono: '809-555-0000',
      items: [{ producto_id: producto.id, cantidad: 1 }],
    }
    const sd = await request(app).post('/api/pedidos').send({ ...base, tipo_envio: 'santo_domingo' })
    const interior = await request(app).post('/api/pedidos').send({ ...base, tipo_envio: 'interior' })

    pedidosCreados.push(sd.body.data.id, interior.body.data.id)

    const diferencia = Number(interior.body.data.total) - Number(sd.body.data.total)
    expect(diferencia).toBe(50)
  })
})

describe('GET /api/pedidos (admin)', () => {
  it('lista también los pedidos de invitado', async () => {
    const creado = await request(app)
      .post('/api/pedidos')
      .send({
        tipo_envio: 'interior',
        nombre: 'Invitada Listada',
        telefono: '809-555-7777',
        items: [{ producto_id: producto.id, cantidad: 1 }],
      })
    pedidosCreados.push(creado.body.data.id)

    const res = await request(app)
      .get('/api/pedidos')
      .set('Authorization', `Bearer ${tokenAdmin}`)

    expect(res.status).toBe(200)
    const encontrado = res.body.data.find((p) => p.id === creado.body.data.id)
    expect(encontrado).toBeDefined()
    expect(encontrado.usuario_id).toBeNull()
    expect(encontrado.invitado_nombre).toBe('Invitada Listada')
    expect(encontrado.invitado_telefono).toBe('809-555-7777')
  })
})
