import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import * as carritoApi from '../api/carrito'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const prevTokenRef = useRef(token)

  // Cargar estado inicial: si ya hay token → backend; si no → localStorage
  useEffect(() => {
    if (token) {
      carritoApi.getCarrito().then((data) => setItems(data.items)).catch(() => {})
    } else {
      try {
        const stored = localStorage.getItem('carrito')
        setItems(stored ? JSON.parse(stored) : [])
      } catch {
        setItems([])
      }
    }
  }, []) // solo al montar

  // Persistir en localStorage cuando no hay sesión
  useEffect(() => {
    if (!token) {
      localStorage.setItem('carrito', JSON.stringify(items))
    }
  }, [items, token])

  // Merge al iniciar sesión (token pasa de null → string)
  useEffect(() => {
    const prev = prevTokenRef.current
    prevTokenRef.current = token

    if (!prev && token) {
      // Acaba de iniciar sesión — fusionar localStorage con backend
      const merge = async () => {
        let locales = []
        try {
          const stored = localStorage.getItem('carrito')
          locales = stored ? JSON.parse(stored) : []
        } catch {}

        for (const item of locales) {
          try {
            await carritoApi.agregarItem(item.id, item.cantidad, item.mensaje, item.personalizacion)
          } catch {}
        }

        localStorage.removeItem('carrito')
        const data = await carritoApi.getCarrito()
        setItems(data.items)
      }
      merge().catch(() => {})
    }

    if (prev && !token) {
      // Cerró sesión — limpiar items (localStorage ya vacío o sin token)
      setItems([])
      localStorage.removeItem('carrito')
    }
  }, [token])

  async function agregarItem(producto, cantidad, mensaje, personalizacion) {
    if (token) {
      try {
        const data = await carritoApi.agregarItem(producto.id, cantidad, mensaje, personalizacion)
        setItems(data.items)
      } catch {}
    } else {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.id === producto.id && i.mensaje === mensaje && i.personalizacion === personalizacion
        )
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = { ...next[idx], cantidad: Math.min(10, next[idx].cantidad + cantidad) }
          return next
        }
        return [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen ?? null, cantidad, mensaje, personalizacion }]
      })
    }
  }

  async function eliminarItem(index) {
    if (token) {
      const item = items[index]
      if (!item) return
      try {
        const data = await carritoApi.eliminarItem(item.item_id)
        setItems(data.items)
      } catch {}
    } else {
      setItems((prev) => prev.filter((_, i) => i !== index))
    }
  }

  async function actualizarCantidad(index, nuevaCantidad) {
    if (nuevaCantidad < 1 || nuevaCantidad > 10) return
    if (token) {
      const item = items[index]
      if (!item) return
      try {
        const data = await carritoApi.actualizarCantidad(item.item_id, nuevaCantidad)
        setItems(data.items)
      } catch {}
    } else {
      setItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, cantidad: nuevaCantidad } : item))
      )
    }
  }

  async function vaciarCarrito() {
    if (token) {
      try {
        const data = await carritoApi.vaciarCarrito()
        setItems(data.items)
      } catch {}
    } else {
      setItems([])
    }
  }

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  const totalPrecio = items.reduce((acc, i) => acc + Number(i.precio) * i.cantidad, 0)

  return (
    <CarritoContext.Provider
      value={{ items, agregarItem, eliminarItem, actualizarCantidad, vaciarCarrito, totalItems, totalPrecio }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CarritoContext)
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  return ctx
}
