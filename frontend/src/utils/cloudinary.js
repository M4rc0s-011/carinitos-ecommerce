// Inyecta transformaciones de Cloudinary en la URL para servir
// imágenes optimizadas (formato auto, calidad auto, redimensionadas).
// Si la URL no es de Cloudinary, la devuelve sin tocar.
export function optimizarImagen(url, { w = 500, h, crop = 'fill' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url

  const parts = [`f_auto`, `q_auto`, `w_${w}`, `c_${crop}`]
  if (h) parts.push(`h_${h}`)
  const transform = parts.join(',')

  // inserta la transformación justo después de /upload/
  return url.replace('/upload/', `/upload/${transform}/`)
}
