import { validarEmail, validarPassword, passwordsCoinciden } from '../utils/validaciones'

describe('validarEmail', () => {
  it('acepta email válido', () => {
    expect(validarEmail('user@example.com')).toBe(true)
    expect(validarEmail('test.user+tag@domain.co')).toBe(true)
  })

  it('rechaza email sin dominio completo', () => {
    expect(validarEmail('noesun@email')).toBe(false)
  })

  it('rechaza email sin @', () => {
    expect(validarEmail('sinArrobas.com')).toBe(false)
  })

  it('rechaza email vacío', () => {
    expect(validarEmail('')).toBe(false)
  })
})

describe('validarPassword', () => {
  it('acepta password de exactamente 8 caracteres', () => {
    expect(validarPassword('12345678')).toBe(true)
  })

  it('acepta password de más de 8 caracteres', () => {
    expect(validarPassword('password123')).toBe(true)
  })

  it('rechaza password de 7 caracteres', () => {
    expect(validarPassword('1234567')).toBe(false)
  })

  it('rechaza string vacío', () => {
    expect(validarPassword('')).toBe(false)
  })
})

describe('passwordsCoinciden', () => {
  it('true cuando son iguales', () => {
    expect(passwordsCoinciden('abc123', 'abc123')).toBe(true)
  })

  it('false cuando son distintas', () => {
    expect(passwordsCoinciden('abc123', 'xyz999')).toBe(false)
  })

  it('false cuando una está vacía', () => {
    expect(passwordsCoinciden('abc123', '')).toBe(false)
  })
})
