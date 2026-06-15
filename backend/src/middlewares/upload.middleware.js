const multer = require('multer')
const cloudinary = require('../config/cloudinary')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Formato no permitido'), false)
  }
})

const subirACloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'carinitos/productos', format: 'jpg', transformation: [{ quality: 'auto' }] },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

module.exports = {
  uploadSingle: upload.single('imagen'),
  subirACloudinary,
}
