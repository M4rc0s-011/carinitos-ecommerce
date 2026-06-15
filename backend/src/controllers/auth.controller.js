const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario.model')
const emailService = require('../services/email.service')
const { firmarToken, generarTokenVerificacion } = require('../utils/auth.utils')

const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    const existe = await Usuario.findByEmail(email)
    if (existe) {
      return res.status(409).json({ ok: false, error: 'El email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const tokenVerif = generarTokenVerificacion()
    const expira = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await Usuario.create({
      nombre,
      email,
      password: hash,
      token_verificacion: tokenVerif,
      token_verificacion_expira: expira,
    })

    emailService.enviarVerificacion(email, nombre, tokenVerif).catch((err) => {
      console.error('[registro] Error enviando email:', err.message)
    })

    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error('[registro]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const encontrado = await Usuario.findByEmail(email)
    if (!encontrado) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })
    }

    const coincide = await bcrypt.compare(password, encontrado.password)
    if (!coincide) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })
    }

    if (encontrado.email_verificado === 0 && encontrado.rol !== 'admin') {
      return res.status(403).json({
        ok: false,
        error: 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
      })
    }

    const usuario = { id: encontrado.id, nombre: encontrado.nombre, email: encontrado.email, rol: encontrado.rol }
    const token = firmarToken(usuario)

    return res.json({ ok: true, token, usuario })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const verificarEmail = async (req, res) => {
  try {
    const { token } = req.query
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Token requerido' })
    }

    const usuario = await Usuario.findByToken(token)
    if (!usuario) {
      return res.status(400).json({ ok: false, error: 'Token inválido o expirado' })
    }

    if (usuario.email_verificado === 1) {
      return res.json({ ok: true })
    }

    await Usuario.marcarVerificado(usuario.id)

    return res.json({ ok: true })
  } catch (err) {
    console.error('[verificarEmail]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

module.exports = { registro, login, verificarEmail }
