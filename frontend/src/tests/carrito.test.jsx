import { renderHook, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from '../context/CarritoContext'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: null }),
}))

vi.mock('../api/carrito', () => ({
  getCarrito: vi.fn(),
  agregarItem: vi.fn(),
  eliminarItem: vi.fn(),
  actualizarCantidad: vi.fn(),
  vaciarCarrito: vi.fn(),
}))

const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>

const producto = (id = 1) => ({
  id,
  nombre: `Producto ${id}`,
  precio: 500,
  imagen: null,
})

beforeEach(() => {
  localStorage.clear()
})

describe('agregarItem', () => {
  it('añade item al carrito', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem(producto(), 1, 'Hola', 'Base roja')
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].nombre).toBe('Producto 1')
  })

  it('incrementa cantidad si mismo producto+mensaje+personalización', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem(producto(), 1, 'Hola', 'Base roja')
      await result.current.agregarItem(producto(), 2, 'Hola', 'Base roja')
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].cantidad).toBe(3)
  })
})

describe('eliminarItem', () => {
  it('elimina item del carrito', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem(producto(), 1, 'Hola', 'Base roja')
    })
    expect(result.current.items).toHaveLength(1)

    await act(async () => {
      await result.current.eliminarItem(0)
    })
    expect(result.current.items).toHaveLength(0)
  })
})

describe('actualizarCantidad', () => {
  it('actualiza la cantidad del item', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem(producto(), 1, 'Hola', 'Base roja')
    })

    await act(async () => {
      await result.current.actualizarCantidad(0, 4)
    })

    expect(result.current.items[0].cantidad).toBe(4)
  })

  it('ignora cantidades fuera del rango 1-10', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem(producto(), 1, 'Hola', 'Base roja')
    })

    await act(async () => {
      await result.current.actualizarCantidad(0, 0)
    })
    expect(result.current.items[0].cantidad).toBe(1)

    await act(async () => {
      await result.current.actualizarCantidad(0, 11)
    })
    expect(result.current.items[0].cantidad).toBe(1)
  })
})

describe('totalPrecio', () => {
  it('suma precio * cantidad de todos los items', async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })

    await act(async () => {
      await result.current.agregarItem({ id: 1, nombre: 'A', precio: 500, imagen: null }, 2, 'msg1', 'per1')
      await result.current.agregarItem({ id: 2, nombre: 'B', precio: 300, imagen: null }, 1, 'msg2', 'per2')
    })

    expect(result.current.totalPrecio).toBe(1300)
  })
})
