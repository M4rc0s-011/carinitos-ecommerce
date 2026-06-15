# Cariñitos - Especificación del Proyecto

## 1. Descripción del negocio
Ecommerce de venta de colgantes artesanales personalizables.
El negocio se basa en la personalización — cada producto puede configurarse
en tipo de madera, material, color de base, diseños en vinil o laser, entre otros.

## 2. Stack tecnológico
### Frontend
- React 18 + Vite
- React Router DOM v6
- Tailwind CSS
- Axios (con interceptors JWT)
- Lucide React
- React Hot Toast
- date-fns

### Backend
- Node.js + Express
- MySQL2
- JWT + bcryptjs
- Multer (uploads de imágenes)
- Nodemailer
- Helmet + express-rate-limit + express-validator

### Base de datos
- MySQL en Railway (nube)

## 3. Roles de usuario
- admin: gestiona productos, opciones, pedidos
- usuario: navega, configura productos, hace pedidos

## 4. Funcionalidades principales
- Catálogo con filtros (precio, color, más vendidos, categoría)
- Página de producto con configurador de personalización
- Carrito de compras
- Checkout → genera PDF → envía por WhatsApp
- Panel de administrador

## 5. Esquema de base de datos
### Catálogos de opciones
- tipos_madera (id, nombre)
- tipos_color (id, nombre, hex)
- tipos_diseño (id, nombre, categoria)
- tipos_material (id, nombre)

### Productos
- productos (id, nombre, descripcion, precio, imagen, categoria_id, stock)
- producto_opciones (id, producto_id, tipo_opcion, opcion_id)

### Carrito
- carrito (id, usuario_id)
- carrito_items (id, carrito_id, producto_id, cantidad)
- carrito_item_opciones (id, carrito_item_id, tipo_opcion, opcion_id)

### Pedidos (snapshot inmutable)
- pedidos (id, usuario_id, fecha, estado)
- pedido_items (id, pedido_id, producto_id, cantidad, precio_unitario)
- pedido_item_opciones (id, pedido_item_id, tipo_opcion, opcion_id)

## 6. Flujo de checkout
1. Usuario configura producto y agrega al carrito
2. Usuario revisa carrito
3. Usuario confirma pedido
4. Sistema genera PDF con resumen del pedido
5. PDF se envía por WhatsApp

## 7. Estructura de archivos
### carinitos-api
src/
  config/      → conexión a base de datos
  controllers/ → lógica de cada endpoint
  routes/      → definición de rutas
  middlewares/ → auth, validación, rate limit
  models/      → consultas SQL
  services/    → lógica de negocio
  helpers/     → funciones utilitarias
  validators/  → validación de inputs
server.js      → punto de entrada

### carinitos-frontend
src/
  api/         → instancia axios y llamadas a la API
  components/  → componentes reutilizables
  pages/       → vistas principales
  hooks/       → custom hooks
  utils/       → funciones utilitarias
  validators/  → validación de formularios

## 8. Variables de entorno
### carinitos-api
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET
PORT

### carinitos-frontend
VITE_API_URL
