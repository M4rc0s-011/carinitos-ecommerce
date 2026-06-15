const { escape } = require('validator')

const SKIP_FIELDS = new Set(['email', 'password', 'imagen', 'token'])

function sanitizeValue(val, key) {
  if (typeof val === 'string') {
    return SKIP_FIELDS.has(key) ? val.trim() : escape(val)
  }
  if (Array.isArray(val)) return val.map((v) => sanitizeValue(v, key))
  if (val !== null && typeof val === 'object') {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, sanitizeValue(v, k)])
    )
  }
  return val
}

module.exports = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k, sanitizeValue(v, k)])
    )
  }
  if (req.params && typeof req.params === 'object') {
    req.params = Object.fromEntries(
      Object.entries(req.params).map(([k, v]) => [k, sanitizeValue(v, k)])
    )
  }
  if (req.query && typeof req.query === 'object') {
    req.query = Object.fromEntries(
      Object.entries(req.query).map(([k, v]) => [k, sanitizeValue(v, k)])
    )
  }
  next()
}
