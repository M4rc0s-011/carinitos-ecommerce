const resend = require('../config/mailer')

const enviarVerificacion = async (email, nombre, token) => {
  const url = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`

  await resend.emails.send({
    from: 'Cariñitos by Jossy <noreply@xn--cariitosbyjossy-1qb.com>',
    to: email,
    subject: 'Verifica tu cuenta en Cariñitos by Jossy',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3d2314;">¡Hola ${nombre}! 🌸</h2>
        <p>Gracias por registrarte en Cariñitos by Jossy.</p>
        <p>Haz click en el botón para verificar tu cuenta:</p>
        <a href="${url}" style="background:#3d2314;color:#fbddc3;padding:12px 24px;border-radius:24px;text-decoration:none;display:inline-block;margin:16px 0;">
          Verificar mi cuenta
        </a>
        <p style="color:#999;font-size:12px;">Si no creaste esta cuenta, ignora este email.</p>
      </div>
    `,
  })
}

module.exports = { enviarVerificacion }
