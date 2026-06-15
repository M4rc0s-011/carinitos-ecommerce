const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const pool = require('../../config/db')
const teardown = require('./helpers/teardown')

const adminToken = () =>
  jwt.sign(
    { id: 999, nombre: 'Admin Test', email: 'admin@test.com', rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

afterAll(teardown)

describe('GET /api/productos', () => {
  it('200 devuelve array', async () => {
    const res = await request(app).get('/api/productos')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

describe('GET /api/productos/:id', () => {
  it('404 con id inexistente', async () => {
    const res = await request(app).get('/api/productos/999999')
    expect(res.status).toBe(404)
  })
})

describe('POST /api/productos', () => {
  it('401 sin token', async () => {
    const res = await request(app)
      .post('/api/productos')
      .field('nombre', 'Test')
      .field('precio', '500')
      .field('stock', '1')
    expect(res.status).toBe(401)
  })

  it('201 con token admin', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken()}`)
      .field('nombre', 'Producto Integration Test')
      .field('precio', '500')
      .field('stock', '1')

    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)

    if (res.body.data?.id) {
      await pool.execute('DELETE FROM productos WHERE id = ?', [res.body.data.id])
    }
  })
})
