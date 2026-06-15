const pool = require('../../../config/db')
let ended = false

module.exports = async () => {
  if (!ended) {
    ended = true
    await pool.end()
  }
}
