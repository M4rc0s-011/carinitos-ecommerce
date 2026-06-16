<div align="center">

# Cariñitos by Jossy

**Plataforma de e-commerce full-stack para colgantes y recuerdos de madera artesanales, totalmente personalizables.**

![Node](https://img.shields.io/badge/Node.js-%E2%89%A518-3d2314?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-5.2-fbddc3?style=for-the-badge&labelColor=3d2314)
![React](https://img.shields.io/badge/React-19.2-edbce0?style=for-the-badge&labelColor=3d2314)
![Vite](https://img.shields.io/badge/Vite-8.0-fbddc3?style=for-the-badge&labelColor=3d2314)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.2-edbce0?style=for-the-badge&labelColor=3d2314)
![MySQL](https://img.shields.io/badge/MySQL-mysql2-fbddc3?style=for-the-badge&labelColor=3d2314)
![License](https://img.shields.io/badge/Licencia-ISC-edbce0?style=for-the-badge&labelColor=3d2314)

</div>

---

## Descripción

**Cariñitos by Jossy** es una aplicación de e-commerce lista para producción, dedicada a la venta de productos de madera artesanales y totalmente personalizables — souvenirs, colgantes para puerta, llaveros, placas y recuerdos para bebé. La plataforma permite a los clientes navegar un catálogo categorizado, configurar productos personalizados, gestionar un carrito de compras y realizar pedidos, mientras que los administradores gestionan toda la tienda desde un panel de control dedicado.

El proyecto está organizado como un **monorepo** con dos aplicaciones independientes:

- **`frontend/`** — una aplicación de página única (SPA) construida con React, Vite y Tailwind CSS.
- **`backend/`** — una API REST construida con Node.js, Express y MySQL.

Ambas se comunican mediante una API REST, con todas las rutas bajo el prefijo `/api`.

---

## Funcionalidades

### Autenticación y cuentas
- Registro de usuarios con contraseñas hasheadas (bcrypt, factor de coste 10).
- **Flujo de verificación de email**: al registrarse se genera un token criptográficamente aleatorio, se envía por correo al usuario y expira a las 24 horas. El inicio de sesión queda bloqueado para cuentas no verificadas que no sean admin.
- Autenticación sin estado mediante **JWT** (expiración de 7 días), transmitido como token `Bearer`.
- Dos roles — **`usuario`** (cliente) y **`admin`** — aplicados mediante middleware de autorización dedicado.

### Tienda (cliente)
- Catálogo completo de productos con búsqueda y filtros dinámicos basados en categorías.
- Páginas de detalle de producto con un configurador de personalización (mensaje a medida y opciones de personalización).
- Carrito de compras con **estrategia de modo dual**: los carritos anónimos persisten en el navegador; los carritos autenticados persisten en el servidor, y ambos se fusionan automáticamente al iniciar sesión.
- Checkout con creación de pedido y enlace de WhatsApp para compartir referencias de producto.
- Área de cuenta del cliente con datos de perfil e historial completo de pedidos.
- Páginas estáticas: historia de la artesana y política de privacidad.

### Gestión de pedidos
- Creación de pedidos asociada al usuario autenticado.
- Ciclo de vida del pedido con estados validados: `pendiente`, `en_proceso`, `completado`, `cancelado`.
- Los clientes consultan sus propios pedidos; los administradores ven y gestionan todos los pedidos.

### Panel de administración
- **Dashboard** con estadísticas de la tienda.
- **Productos**: CRUD completo, incluyendo subida de imágenes a Cloudinary, borrado lógico y conmutador activo/inactivo.
- **Categorías**: CRUD completo de las colecciones que alimentan los filtros del catálogo.
- **Pedidos**: vista tabular con cambio de estado en línea y detalle expandible.
- **Usuarios**: vista tabular con la posibilidad de eliminar usuarios no administradores.

### Gestión de imágenes
- Las subidas se reciben en memoria mediante Multer y se transmiten a **Cloudinary**.
- Todas las subidas se normalizan a JPEG en el momento de la carga, garantizando un renderizado consistente en el navegador independientemente del formato original.
- Las imágenes se almacenan exclusivamente en Cloudinary — nunca en el servidor de la aplicación ni en la base de datos.

### Email transaccional
- Los correos de verificación de cuenta se entregan a través de **Resend** desde el dominio verificado del proyecto.

### Seguridad
- **Helmet** para endurecer las cabeceras HTTP de respuesta, incluyendo una directiva personalizada de Content-Security-Policy `img-src` que autoriza Cloudinary.
- **Límite de peticiones** (`express-rate-limit`) con políticas por endpoint:

  | Ámbito        | Ventana      | Máx. peticiones |
  |---------------|--------------|-----------------|
  | API global    | 15 minutos   | 100             |
  | Login         | 15 minutos   | 10              |
  | Registro      | 60 minutos   | 5               |

- Middleware de **sanitización de entrada** que escapa recursivamente los valores de tipo cadena en el cuerpo, los parámetros y la query de la petición (omitiendo campos donde el escape corrompería los datos, como `email`, `password`, `token` e `imagen`).
- **Validación de peticiones** con `express-validator` en los endpoints de autenticación y de productos/categorías.
- **CORS** con una lista blanca estricta de orígenes (desarrollo local, el dominio de producción y los despliegues preview de Vercel).
- Todos los secretos y cadenas de conexión provienen de variables de entorno.

---

## Stack tecnológico

### Frontend

| Paquete              | Versión  | Propósito                        |
|----------------------|----------|----------------------------------|
| `react`              | 19.2.5   | Librería de UI                   |
| `react-dom`          | 19.2.5   | Renderizador del DOM             |
| `react-router-dom`   | 7.14.2   | Enrutamiento del lado del cliente|
| `axios`              | 1.15.2   | Cliente HTTP                     |
| `tailwindcss`        | 4.2.4    | Estilos utility-first            |
| `@tailwindcss/vite`  | 4.2.4    | Integración de Tailwind con Vite |
| `lucide-react`       | 1.8.0    | Conjunto de íconos               |
| `react-hot-toast`    | 2.6.0    | Notificaciones tipo toast        |
| `date-fns`           | 4.1.0    | Formateo de fechas               |

**Herramientas:** `vite` 8.0.9, `vitest` 4.1.5, `@vitest/coverage-v8` 4.1.5, `@testing-library/react` 16.3.2, `@testing-library/jest-dom` 6.9.1, `jsdom` 29.1.1, `eslint` 9.39.4.

### Backend

| Paquete                     | Versión  | Propósito                            |
|-----------------------------|----------|--------------------------------------|
| `express`                   | 5.2.1    | Framework web                        |
| `mysql2`                    | 3.22.0   | Driver de MySQL (pool con promesas)  |
| `jsonwebtoken`              | 9.0.3    | Firma y verificación de JWT          |
| `bcryptjs`                  | 3.0.3    | Hash de contraseñas                  |
| `helmet`                    | 8.1.0    | Cabeceras HTTP seguras               |
| `express-rate-limit`        | 8.3.2    | Límite de peticiones                 |
| `express-validator`         | 7.3.2    | Validación y sanitización            |
| `cors`                      | 2.8.6    | Intercambio de recursos entre orígenes |
| `multer`                    | 2.1.1    | Manejo de multipart/form-data        |
| `multer-storage-cloudinary` | 2.2.1    | Adaptador de almacenamiento Cloudinary |
| `cloudinary`                | 2.10.0   | SDK de hospedaje de imágenes         |
| `resend`                    | 6.12.2   | Email transaccional                  |
| `dotenv`                    | 17.4.2   | Carga de variables de entorno        |

**Herramientas:** `nodemon` 3.1.14, `vitest` 4.1.5, `supertest` 7.2.2, `k6` (pruebas de estrés).

### Servicios externos
- **MySQL** — base de datos relacional (alojada en Railway en producción).
- **Cloudinary** — almacenamiento y transformación de imágenes.
- **Resend** — entrega de email transaccional.

---

## Estructura del proyecto

```
carinitos-app/
├── backend/
│   ├── server.js                 # Punto de entrada: carga env, DB, arranca el servidor HTTP
│   └── src/
│       ├── app.js                # App de Express: middleware y montaje de rutas
│       ├── config/               # db (pool MySQL), cloudinary, mailer (Resend)
│       ├── routes/               # auth, productos, categorias, pedidos, carrito, usuarios
│       ├── controllers/          # Manejadores de peticiones por recurso
│       ├── models/               # Capa de acceso a datos SQL
│       ├── middlewares/          # auth, rateLimit, sanitize, upload
│       ├── validators/           # Reglas de express-validator
│       ├── services/             # email.service
│       ├── utils/                # Helpers de auth y carrito
│       └── tests/                # Pruebas unitarias, de integración y de estrés (k6)
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx              # Bootstrap de la app
        ├── App.jsx               # Composición de router y layout
        ├── api/                  # Instancia de Axios y módulos de API por recurso
        ├── context/             # AuthContext, CarritoContext
        ├── components/           # Navbar, Footer, ProductCard, guards de rutas
        ├── pages/                # Páginas públicas + subpanel admin/
        └── utils/                # Helpers de validación
```

---

## Requisitos previos

- **Node.js ≥ 18** (se recomienda Node 20 LTS).
- Una instancia de **MySQL** en ejecución (local o alojada) con el esquema de la aplicación.
- Una cuenta de **Cloudinary** (cloud name, API key, API secret).
- Una cuenta de **Resend** con un dominio de envío verificado y una API key.

---

## Instalación

Clona el repositorio e instala las dependencias de cada aplicación por separado.

```bash
git clone https://github.com/M4rc0s-011/carinitos-ecommerce.git
cd carinitos-ecommerce

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable                 | Descripción                                        | Ejemplo                              |
|--------------------------|----------------------------------------------------|--------------------------------------|
| `DB_HOST`                | Host de MySQL                                      | `localhost`                          |
| `DB_PORT`                | Puerto de MySQL                                    | `3306`                               |
| `DB_USER`                | Usuario de MySQL                                   | `root`                               |
| `DB_PASSWORD`            | Contraseña de MySQL                                | `tu_password_db`                     |
| `DB_NAME`                | Nombre de la base de datos                         | `carinitos`                          |
| `JWT_SECRET`             | Secreto usado para firmar los JWT                  | `una_cadena_larga_aleatoria`         |
| `CLOUDINARY_CLOUD_NAME`  | Cloud name de Cloudinary                           | `tu_cloud_name`                      |
| `CLOUDINARY_API_KEY`     | API key de Cloudinary                              | `000000000000000`                    |
| `CLOUDINARY_API_SECRET`  | API secret de Cloudinary                           | `tu_secreto_cloudinary`              |
| `RESEND_API_KEY`         | API key de Resend                                  | `re_xxxxxxxxxxxxxxxx`                |
| `FRONTEND_URL`           | URL pública del frontend (CORS + enlaces de email) | `http://localhost:5173`              |
| `PORT`                   | Puerto HTTP en el que escucha la API               | `3000`                               |
| `NODE_ENV`               | Entorno de ejecución                               | `development`                        |

**Ejemplo de `backend/.env`:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_db
DB_NAME=carinitos
JWT_SECRET=una_cadena_larga_aleatoria
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=000000000000000
CLOUDINARY_API_SECRET=tu_secreto_cloudinary
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### Frontend (`frontend/.env`)

| Variable        | Descripción                       | Ejemplo                     |
|-----------------|-----------------------------------|-----------------------------|
| `VITE_API_URL`  | URL base de la API del backend    | `http://localhost:3000`     |

**Ejemplo de `frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000
```

---

## Ejecución en desarrollo

Ejecuta el backend y el frontend en dos terminales separadas.

**Backend** (con recarga automática):

```bash
cd backend
npm run dev
```

La API arranca en `http://localhost:3000` (o el valor de `PORT`).

**Frontend:**

```bash
cd frontend
npm run dev
```

La SPA se sirve con Vite en `http://localhost:5173`.

---

## Referencia de la API

Todos los endpoints llevan el prefijo `/api`.

### Auth — `/api/auth`
| Método | Ruta                  | Acceso  | Descripción                          |
|--------|-----------------------|---------|--------------------------------------|
| POST   | `/registro`           | Público | Registrar una cuenta nueva           |
| POST   | `/login`              | Público | Autenticarse y recibir un JWT        |
| GET    | `/verificar-email`    | Público | Verificar un email vía `?token=`     |

### Productos — `/api/productos`
| Método | Ruta           | Acceso  | Descripción                              |
|--------|----------------|---------|------------------------------------------|
| GET    | `/`            | Público | Listar productos activos (filtros query) |
| GET    | `/:id`         | Público | Detalle de producto                      |
| GET    | `/admin`       | Admin   | Listar todos (incluye inactivos)         |
| POST   | `/`            | Admin   | Crear producto (subida de imagen)        |
| PUT    | `/:id`         | Admin   | Actualizar producto (subida de imagen)   |
| PATCH  | `/:id/activo`  | Admin   | Conmutar estado activo                    |
| DELETE | `/:id`         | Admin   | Borrado lógico de producto               |

### Categorías — `/api/categorias`
| Método | Ruta     | Acceso  | Descripción          |
|--------|----------|---------|----------------------|
| GET    | `/`      | Público | Listar categorías    |
| POST   | `/`      | Admin   | Crear categoría      |
| PUT    | `/:id`   | Admin   | Actualizar categoría |
| DELETE | `/:id`   | Admin   | Eliminar categoría   |

### Pedidos — `/api/pedidos`
| Método | Ruta            | Acceso | Descripción                   |
|--------|-----------------|--------|-------------------------------|
| POST   | `/`             | Auth   | Crear un pedido               |
| GET    | `/`             | Admin  | Listar todos los pedidos      |
| GET    | `/mis-pedidos`  | Auth   | Listar los pedidos del usuario |
| GET    | `/:id`          | Auth   | Detalle de pedido             |
| PUT    | `/:id/estado`   | Admin  | Actualizar estado del pedido  |
| DELETE | `/:id`          | Admin  | Eliminar un pedido            |

### Carrito — `/api/carrito`
| Método | Ruta           | Acceso | Descripción              |
|--------|----------------|--------|--------------------------|
| GET    | `/`            | Auth   | Obtener el carrito actual |
| POST   | `/items`       | Auth   | Agregar un ítem          |
| PUT    | `/items/:id`   | Auth   | Actualizar cantidad      |
| DELETE | `/items/:id`   | Auth   | Eliminar un ítem         |
| DELETE | `/`            | Auth   | Vaciar el carrito        |

### Usuarios — `/api/usuarios`
| Método | Ruta     | Acceso | Descripción                |
|--------|----------|--------|----------------------------|
| GET    | `/`      | Admin  | Listar usuarios            |
| DELETE | `/:id`   | Admin  | Eliminar un usuario no admin |

---

## Pruebas

La suite de pruebas del backend usa **Vitest** con **Supertest** para pruebas de integración a nivel HTTP, y **k6** para pruebas de carga/estrés. El frontend usa **Vitest** con **Testing Library**.

### Backend

```bash
cd backend

npm test                 # Ejecuta toda la suite de Vitest
npm run test:unit        # Solo pruebas unitarias (src/tests/unit)
npm run test:integration # Solo pruebas de integración (src/tests/integration)
npm run test:watch       # Modo watch
npm run test:coverage    # Reporte de cobertura
```

Las **pruebas de estrés (k6)** se encuentran en `backend/src/tests/stress/` y se ejecutan con el runner de k6. Aceptan configuración mediante variables de entorno (`BASE_URL`, `TEST_EMAIL`, `TEST_PASSWORD`):

```bash
k6 run backend/src/tests/stress/auth.stress.js
k6 run backend/src/tests/stress/productos.stress.js
k6 run backend/src/tests/stress/flujo-completo.stress.js
```

### Frontend

```bash
cd frontend

npm test                 # Ejecuta toda la suite de Vitest
npm run test:watch       # Modo watch
npm run test:coverage    # Reporte de cobertura
```

---

## Despliegue

La aplicación se despliega como dos servicios alojados de forma independiente:

- **Frontend** — compilado con `npm run build` (Vite) hacia `frontend/dist/` y servido como SPA estática en **Vercel**. El *Root Directory* del despliegue está configurado en `frontend`, y `VITE_API_URL` apunta a la API de producción.
- **Backend** — desplegado en **Railway** con el *Root Directory* en `backend`, arrancado con `npm start`. La base de datos MySQL también está alojada en Railway.

**Consideraciones de producción:**
- Establecer `NODE_ENV=production` para que el backend dependa del entorno inyectado por la plataforma en lugar de un archivo `.env` local.
- Configurar `FRONTEND_URL` con el origen del frontend de producción; la lista blanca de CORS ya permite el dominio de producción y los despliegues preview de Vercel.
- Aprovisionar todas las credenciales de Cloudinary y Resend como variables de entorno en el host.
- La API corre detrás de un proxy (`trust proxy` está habilitado) para que el límite de peticiones y la detección de IP del cliente funcionen correctamente.

---

## Scripts disponibles

### Backend (`backend/package.json`)

| Script             | Comando                              | Descripción                          |
|--------------------|--------------------------------------|--------------------------------------|
| `start`            | `node server.js`                     | Arranca la API en producción         |
| `dev`              | `nodemon server.js`                  | Arranca la API con recarga automática |
| `test`             | `vitest run`                         | Ejecuta toda la suite de pruebas     |
| `test:unit`        | `vitest run src/tests/unit`          | Ejecuta las pruebas unitarias        |
| `test:integration` | `vitest run src/tests/integration`   | Ejecuta las pruebas de integración   |
| `test:watch`       | `vitest`                             | Ejecuta las pruebas en modo watch    |
| `test:coverage`    | `vitest run --coverage`              | Ejecuta las pruebas con cobertura     |

### Frontend (`frontend/package.json`)

| Script          | Comando          | Descripción                        |
|-----------------|------------------|------------------------------------|
| `dev`           | `vite`           | Arranca el servidor de desarrollo de Vite |
| `build`         | `vite build`     | Compila el bundle de producción    |
| `preview`       | `vite preview`   | Previsualiza la compilación de producción |
| `lint`          | `eslint .`       | Analiza el código con el linter    |
| `test`          | `vitest run`     | Ejecuta toda la suite de pruebas   |
| `test:watch`    | `vitest`         | Ejecuta las pruebas en modo watch  |
| `test:coverage` | `vitest run --coverage` | Ejecuta las pruebas con cobertura |

---

<div align="center">

**Cariñitos by Jossy** — hecho a mano con cariño.

</div>
