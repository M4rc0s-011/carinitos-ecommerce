const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  const hash = await bcrypt.hash('Amirisaac1705', 10);
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await conn.query(
    'UPDATE usuarios SET password = ? WHERE email = ?',
    [hash, 'jossira.santana@gmail.com']
  );
  console.log('✅ Password actualizado');
  await conn.end();
}

run().catch(console.error);
