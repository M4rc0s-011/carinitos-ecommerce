export const validarEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validarPassword = (password) =>
  typeof password === 'string' && password.length >= 8

export const passwordsCoinciden = (a, b) => a === b
