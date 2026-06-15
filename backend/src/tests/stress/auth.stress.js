import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = __ENV.TEST_EMAIL || 'admin@carinitos.com'
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'Admin123!'

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
}

export function setup() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  if (res.status !== 200) {
    throw new Error(`Login fallo en setup: ${res.status} ${res.body}`)
  }

  return { token: res.json('token') }
}

export default function (data) {
  const res = http.get(`${BASE_URL}/api/pedidos/mis-pedidos`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  check(res, {
    'status 200': (r) => r.status === 200,
    'ok true': (r) => r.json('ok') === true,
  })

  sleep(1)
}
