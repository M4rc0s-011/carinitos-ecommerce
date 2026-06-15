const request = require('supertest')
const app = require('../../app')
const pool = require('../../config/db')
const { crearUsuario, limpiarUsuario } = require('./helpers/seed')
const teardown = require('./helpers/teardown')

vi.mock('../../services/email.service', () => ({
  enviarVerificacion: vi.fn().mockResolvedValue(true),
}))

afterAll(teardown)

describe('POST /api/auth/registro', () => {
  it('201 con datos válidos', async () => {
    const email = `test-reg-${Date.now()}@test.com`
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Test Reg', email, password: 'test1234' })

    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)

    const [rows] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email])
    if (rows[0]) await limpiarUsuario(rows[0].id)
  }, 15000)

  it('409 con email duplicado', async () => {
    const u = await crearUsuario({ nombre: 'Dup Test', email: `dup-${Date.now()}@test.com` })
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Dup Test', email: u.email, password: 'test1234' })

    expect(res.status).toBe(409)
    await limpiarUsuario(u.id)
  })
})

describe('POST /api/auth/login', () => {
  it('401 con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })

  it('403 con email no verificado', async () => {
    const u = await crearUsuario({
      nombre: 'Sin Verificar',
      email: `noverif-${Date.now()}@test.com`,
      password: 'test1234',
      verificado: false,
    })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: u.email, password: u.password })

    expect(res.status).toBe(403)
    await limpiarUsuario(u.id)
  })
})
