# Stress Tests — k6

## Instalación

```bash
# macOS
brew install k6

# Windows (Chocolatey)
choco install k6

# Windows (winget)
winget install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

## Variables de entorno requeridas

| Variable        | Descripción                              |
|-----------------|------------------------------------------|
| `BASE_URL`      | URL base de la API (default: localhost)  |
| `TEST_EMAIL`    | Email de usuario verificado en la DB     |
| `TEST_PASSWORD` | Contraseña de ese usuario                |

## ⚠️ Rate limiting

El servidor tiene rate limiting activo:
- Login: **10 requests / 15 minutos** por IP
- API general: **100 requests / 15 minutos** por IP

Con 50 VUs desde la misma máquina, el test de auth agotará el límite de login casi de inmediato y recibirá respuestas 429. Para stress testing real, levanta el servidor con `NODE_ENV=test` — el rate limiter lo detecta y omite los límites:

```bash
NODE_ENV=test node server.js
```

## Scripts

### 1. auth.stress.js — 50 VUs × 30s

Mide la capacidad de verificar JWTs bajo carga. `setup()` hace login una vez, luego 50 VUs golpean `GET /api/pedidos/mis-pedidos` (requiere auth, sin rate limit). Más representativo que testear login directo, que el rate limiter bloquea por diseño.

```bash
k6 run \
  -e BASE_URL=http://localhost:3000 \
  -e TEST_EMAIL=tu@email.com \
  -e TEST_PASSWORD=tupassword \
  src/tests/stress/auth.stress.js
```

Contra Railway (producción):

```bash
k6 run \
  -e BASE_URL=https://tu-api.railway.app \
  -e TEST_EMAIL=tu@email.com \
  -e TEST_PASSWORD=tupassword \
  src/tests/stress/auth.stress.js
```

**Umbrales:** p95 < 500ms · error rate < 1%

---

### 2. productos.stress.js — 100 VUs × 30s

Mide el endpoint más usado. No requiere autenticación.

```bash
k6 run \
  -e BASE_URL=http://localhost:3000 \
  src/tests/stress/productos.stress.js
```

**Umbrales:** p95 < 300ms · error rate < 1%

---

### 3. flujo-completo.stress.js — 30 VUs × 60s

Simula el flujo real de un usuario: catálogo → producto → carrito. Login se hace una sola vez en `setup()` y el token se reutiliza en todas las iteraciones (evita rate limiter).

```bash
k6 run \
  -e BASE_URL=http://localhost:3000 \
  -e TEST_EMAIL=tu@email.com \
  -e TEST_PASSWORD=tupassword \
  src/tests/stress/flujo-completo.stress.js
```

**Umbrales:** p95 < 800ms · error rate < 2%

---

## Salida de ejemplo

```
✓ status 200
✓ ok true

checks.........................: 100.00% ✓ 2940  ✗ 0
data_received..................: 4.2 MB  140 kB/s
http_req_duration..............: avg=45ms  p(90)=89ms  p(95)=112ms
http_req_failed................: 0.00%   ✓ 0     ✗ 1470
```

## Ver resultados en HTML

```bash
k6 run --out json=resultado.json src/tests/stress/productos.stress.js
```

Luego abre el JSON con [k6 dashboard](https://grafana.com/grafana/dashboards/18030) o usa `k6 cloud` si tienes cuenta en Grafana Cloud.
