const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const authRoutes       = require('./routes/auth.routes')
const productosRoutes  = require('./routes/productos.routes')
const categoriasRoutes = require('./routes/categorias.routes')
const pedidosRoutes    = require('./routes/pedidos.routes')
const usuariosRoutes   = require('./routes/usuarios.routes')
const carritoRoutes    = require('./routes/carrito.routes')
const { apiLimiter }   = require('./middlewares/rateLimit.middleware')
const sanitize         = require('./middlewares/sanitize.middleware')

const app = express()

app.set('trust proxy', 1)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'res.cloudinary.com'],
    },
  },
}))
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'https://xn--cariitosbyjossy-1qb.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}))
app.use(express.json())
app.use(apiLimiter)
app.use(sanitize)

app.use('/api/auth',       authRoutes)
app.use('/api/productos',  productosRoutes)
app.use('/api/categorias', categoriasRoutes)
app.use('/api/pedidos',    pedidosRoutes)
app.use('/api/usuarios',   usuariosRoutes)
app.use('/api/carrito',    carritoRoutes)

app.get('/', (req, res) => res.json({ mensaje: 'API Cariñitos funcionando' }))

module.exports = app
