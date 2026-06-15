const calcularSubtotal = (items) =>
  items.reduce((acc, item) => acc + Number(item.precio_unitario) * item.cantidad, 0)

const calcularAdelanto = (total) => Math.ceil(total / 2)

const calcularTotalConEnvio = (subtotal, costoEnvio) => subtotal + costoEnvio

module.exports = { calcularSubtotal, calcularAdelanto, calcularTotalConEnvio }
