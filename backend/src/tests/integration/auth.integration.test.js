const request = require('supertest')
const app = require('../../app')
const pool = require('../../config/db')
const { crearUsuario, limpiarUsuario } = require('./helpers/seed')
const teardown = require('./helpers/teardown')

const emailService = require('../../services/email.service')

// El controlador llama emailService.enviarVerificacion(...) sobre el objeto del
// módulo, así que spyOn lo intercepta (vi.mock no aplica a require de CJS).
let enviarVerificacion

beforeEach(() => {
  enviarVerificacion = vi.spyOn(emailService, 'enviarVerificacion').mockResolvedValue(true)
})

afterEach(() => {
  vi.restoreAllMocks()
})

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

describe('GET /api/auth/verificar-email', () => {
  it('400 sin token', async () => {
    const res = await request(app).get('/api/auth/verificar-email')
    expect(res.status).toBe(400)
  })

  it('400 motivo invalido con token inexistente', async () => {
    const res = await request(app).get('/api/auth/verificar-email?token=noexisteestetoken')
    expect(res.status).toBe(400)
    expect(res.body.motivo).toBe('invalido')
  })

  it('400 motivo expirado con token vencido', async () => {
    const u = await crearUsuario({
      nombre: 'Token Vencido',
      email: `exp-${Date.now()}@test.com`,
      token: `tk-exp-${Date.now()}`,
      tokenExpiraEn: -1000,
    })
    const res = await request(app).get(`/api/auth/verificar-email?token=${u.token}`)

    expect(res.status).toBe(400)
    expect(res.body.motivo).toBe('expirado')

    const [rows] = await pool.execute('SELECT email_verificado FROM usuarios WHERE id = ?', [u.id])
    expect(rows[0].email_verificado).toBe(0)

    await limpiarUsuario(u.id)
  })

  it('200 con token válido: verifica y anula el token', async () => {
    const u = await crearUsuario({
      nombre: 'Token Bueno',
      email: `ok-${Date.now()}@test.com`,
      token: `tk-ok-${Date.now()}`,
    })
    const res = await request(app).get(`/api/auth/verificar-email?token=${u.token}`)

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)

    const [rows] = await pool.execute(
      'SELECT email_verificado, token_verificacion, token_verificacion_expira FROM usuarios WHERE id = ?',
      [u.id]
    )
    expect(rows[0].email_verificado).toBe(1)
    expect(rows[0].token_verificacion).toBeNull()
    expect(rows[0].token_verificacion_expira).toBeNull()

    await limpiarUsuario(u.id)
  })

  it('el token verificado no se puede reutilizar', async () => {
    const u = await crearUsuario({
      nombre: 'Token Reuso',
      email: `reuso-${Date.now()}@test.com`,
      token: `tk-reuso-${Date.now()}`,
    })
    await request(app).get(`/api/auth/verificar-email?token=${u.token}`)
    const res = await request(app).get(`/api/auth/verificar-email?token=${u.token}`)

    expect(res.status).toBe(400)
    expect(res.body.motivo).toBe('invalido')

    await limpiarUsuario(u.id)
  })
})

describe('POST /api/auth/reenviar-verificacion', () => {
  it('400 con email inválido', async () => {
    const res = await request(app)
      .post('/api/auth/reenviar-verificacion')
      .send({ email: 'no-es-un-email' })

    expect(res.status).toBe(400)
  })

  it('regenera el token y manda email a cuenta sin verificar', async () => {
    const tokenViejo = `tk-viejo-${Date.now()}`
    const u = await crearUsuario({
      nombre: 'Pide Reenvio',
      email: `reenvio-${Date.now()}@test.com`,
      token: tokenViejo,
    })
    const res = await request(app)
      .post('/api/auth/reenviar-verificacion')
      .send({ email: u.email })

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(enviarVerificacion).toHaveBeenCalledTimes(1)

    const [rows] = await pool.execute('SELECT token_verificacion FROM usuarios WHERE id = ?', [u.id])
    expect(rows[0].token_verificacion).not.toBe(tokenViejo)
    expect(rows[0].token_verificacion).toHaveLength(64)

    await limpiarUsuario(u.id)
  })

  it('respuesta neutra y sin email si la cuenta no existe', async () => {
    const res = await request(app)
      .post('/api/auth/reenviar-verificacion')
      .send({ email: `fantasma-${Date.now()}@test.com` })

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(enviarVerificacion).not.toHaveBeenCalled()
  })

  it('respuesta neutra y sin email si ya está verificada', async () => {
    const u = await crearUsuario({
      nombre: 'Ya Verificada',
      email: `yaverif-${Date.now()}@test.com`,
      verificado: true,
    })
    const res = await request(app)
      .post('/api/auth/reenviar-verificacion')
      .send({ email: u.email })

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(enviarVerificacion).not.toHaveBeenCalled()

    await limpiarUsuario(u.id)
  })

  it('500 si el envío del email falla', async () => {
    enviarVerificacion.mockRejectedValue(new Error('Resend caído'))
    const u = await crearUsuario({
      nombre: 'Email Falla',
      email: `falla-${Date.now()}@test.com`,
      token: `tk-falla-${Date.now()}`,
    })
    const res = await request(app)
      .post('/api/auth/reenviar-verificacion')
      .send({ email: u.email })

    expect(res.status).toBe(500)

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
