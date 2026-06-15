import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = __ENV.TEST_EMAIL || 'admin@carinitos.com'
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'Admin123!'

export const options = {
  vus: 30,
  duration: '60s',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
}

export function setup() {
  const productosRes = http.get(`${BASE_URL}/api/productos`)
  const body = productosRes.json()
  const productIds = (body.data || []).map((p) => p.id)

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  if (loginRes.status !== 200) {
    throw new Error(`Login fallo en setup: ${loginRes.status} ${loginRes.body}`)
  }

  const token = loginRes.json('token')
  return { productIds, token }
}

export default function (data) {
  const { productIds, token } = data

  // 1. GET /api/productos
  const listRes = http.get(`${BASE_URL}/api/productos`)
  check(listRes, { 'productos 200': (r) => r.status === 200 })
  sleep(0.5)

  // 2. GET /api/productos/:id (producto aleatorio)
  if (productIds.length > 0) {
    const id = productIds[Math.floor(Math.random() * productIds.length)]
    const prodRes = http.get(`${BASE_URL}/api/productos/${id}`)
    check(prodRes, { 'producto 200': (r) => r.status === 200 })
    sleep(0.5)
  }

  // 3. GET /api/carrito (token reutilizado de setup)
  const carritoRes = http.get(`${BASE_URL}/api/carrito`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  check(carritoRes, { 'carrito 200': (r) => r.status === 200 })

  sleep(1)
}
