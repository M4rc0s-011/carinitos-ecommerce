const { calcularSubtotal, calcularAdelanto, calcularTotalConEnvio } = require('../../utils/carrito.utils')

describe('calcularSubtotal', () => {
  it('suma precio_unitario * cantidad de cada item', () => {
    const items = [
      { precio_unitario: 500, cantidad: 2 },
      { precio_unitario: 300, cantidad: 1 },
    ]
    expect(calcularSubtotal(items)).toBe(1300)
  })

  it('devuelve 0 si items está vacío', () => {
    expect(calcularSubtotal([])).toBe(0)
  })

  it('maneja precio_unitario como string (tipo MySQL)', () => {
    const items = [{ precio_unitario: '750', cantidad: 2 }]
    expect(calcularSubtotal(items)).toBe(1500)
  })
})

describe('calcularAdelanto', () => {
  it('devuelve 50% exacto en total par', () => {
    expect(calcularAdelanto(1000)).toBe(500)
  })

  it('redondea hacia arriba en total impar', () => {
    expect(calcularAdelanto(1001)).toBe(501)
    expect(calcularAdelanto(1299)).toBe(650)
  })
})

describe('calcularTotalConEnvio', () => {
  it('suma subtotal y costo de envío', () => {
    expect(calcularTotalConEnvio(1000, 250)).toBe(1250)
  })

  it('subtotal cero solo devuelve costo de envío', () => {
    expect(calcularTotalConEnvio(0, 250)).toBe(250)
  })
})
