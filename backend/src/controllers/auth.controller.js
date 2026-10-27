const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario.model')
const emailService = require('../services/email.service')
const { firmarToken, generarTokenVerificacion } = require('../utils/auth.utils')

const TOKEN_VIGENCIA_MS = 24 * 60 * 60 * 1000

const nuevaCredencialVerificacion = () => ({
  token: generarTokenVerificacion(),
  expira: new Date(Date.now() + TOKEN_VIGENCIA_MS),
})

const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    const existe = await Usuario.findByEmail(email)
    if (existe) {
      return res.status(409).json({ ok: false, error: 'El email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const { token, expira } = nuevaCredencialVerificacion()

    await Usuario.create({
      nombre,
      email,
      password: hash,
      token_verificacion: token,
      token_verificacion_expira: expira,
    })

    try {
      await emailService.enviarVerificacion(email, nombre, token)
    } catch (err) {
      console.error('[registro] Error enviando email:', err.message)
      return res.status(201).json({ ok: true, emailEnviado: false })
    }

    return res.status(201).json({ ok: true, emailEnviado: true })
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
      return res.status(400).json({
        ok: false,
        motivo: 'invalido',
        error: 'Este enlace no es válido o ya fue usado. Si tu cuenta está verificada, inicia sesión.',
      })
    }

    if (usuario.email_verificado === 1) {
      return res.json({ ok: true })
    }

    if (!usuario.token_vigente) {
      return res.status(400).json({
        ok: false,
        motivo: 'expirado',
        error: 'El enlace de verificación expiró. Pide uno nuevo.',
      })
    }

    await Usuario.marcarVerificado(usuario.id)

    return res.json({ ok: true })
  } catch (err) {
    console.error('[verificarEmail]', err)
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' })
  }
}

const reenviarVerificacion = async (req, res) => {
  try {
    const { email } = req.body
    const usuario = await Usuario.findByEmail(email)

    // Respuesta uniforme: no revela si el email existe ni si ya está verificado.
    const respuestaNeutra = {
      ok: true,
      mensaje: 'Si la cuenta existe y está pendiente de verificar, te enviamos un enlace nuevo.',
    }

    if (!usuario || usuario.email_verificado === 1) {
      return res.json(respuestaNeutra)
    }

    const { token, expira } = nuevaCredencialVerificacion()
    await Usuario.actualizarTokenVerificacion(usuario.id, token, expira)
    await emailService.enviarVerificacion(usuario.email, usuario.nombre, token)

    return res.json(respuestaNeutra)
  } catch (err) {
    console.error('[reenviarVerificacion]', err)
    return res.status(500).json({ ok: false, error: 'No pudimos enviar el email. Intenta más tarde.' })
  }
}

module.exports = { registro, login, verificarEmail, reenviarVerificacion }
