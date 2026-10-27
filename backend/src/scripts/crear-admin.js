// Crea o actualiza la cuenta admin leyendo ADMIN_EMAIL y ADMIN_PASSWORD del .env.
// Las credenciales nunca se escriben en el repo. Uso: npm run crear-admin
require('dotenv').config()
const bcrypt = require('bcryptjs')
const pool = require('../config/db')

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

async function run() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Falta ADMIN_EMAIL o ADMIN_PASSWORD en el .env')
    process.exit(1)
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const [res] = await pool.execute(
    `INSERT INTO usuarios (nombre, email, password, rol, email_verificado)
     VALUES ('Admin', ?, ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE password = VALUES(password), rol = 'admin', email_verificado = 1`,
    [ADMIN_EMAIL, hash]
  )

  console.log(res.affectedRows === 1 ? `Admin creado: ${ADMIN_EMAIL}` : `Password actualizado: ${ADMIN_EMAIL}`)
  await pool.end()
}

run().catch(err => {
  console.error(err.message)
  process.exit(1)
})
