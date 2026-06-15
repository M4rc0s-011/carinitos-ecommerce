import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const res = http.get(`${BASE_URL}/api/productos`)

  check(res, {
    'status 200': (r) => r.status === 200,
    'ok true': (r) => r.json('ok') === true,
    'es array': (r) => Array.isArray(r.json('data')),
  })

  sleep(1)
}
