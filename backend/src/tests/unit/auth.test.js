const bcrypt = require('bcryptjs')
const { firmarToken, verificarToken, generarTokenVerificacion } = require('../../utils/auth.utils')

describe('Contraseñas', () => {
  const password = 'mipassword123'
  let hash

  beforeAll(async () => {
    hash = await bcrypt.hash(password, 10)
  })

  it('hash es distinto al original', () => {
    expect(hash).not.toBe(password)
  })

  it('compare devuelve true con password correcto', async () => {
    expect(await bcrypt.compare(password, hash)).toBe(true)
  })

  it('compare devuelve false con password incorrecto', async () => {
    expect(await bcrypt.compare('otropassword', hash)).toBe(false)
  })
})

describe('JWT', () => {
  const usuario = { id: 1, nombre: 'Test', email: 'test@example.com', rol: 'usuario' }
  let token

  beforeAll(() => {
    token = firmarToken(usuario)
  })

  it('token contiene id, email y rol correctos', () => {
    const decoded = verificarToken(token)
    expect(decoded.id).toBe(usuario.id)
    expect(decoded.email).toBe(usuario.email)
    expect(decoded.rol).toBe(usuario.rol)
  })

  it('token inválido lanza error', () => {
    expect(() => verificarToken('token.invalido.aqui')).toThrow()
  })
})

describe('Token de verificación', () => {
  it('produce string hex de 64 caracteres', () => {
    const token = generarTokenVerificacion()
    expect(token).toHaveLength(64)
    expect(/^[a-f0-9]+$/.test(token)).toBe(true)
  })

  it('dos tokens consecutivos son distintos', () => {
    expect(generarTokenVerificacion()).not.toBe(generarTokenVerificacion())
  })
})
