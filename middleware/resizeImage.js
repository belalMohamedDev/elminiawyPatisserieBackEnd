const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// image processing
const resizeImage = (directorName) => asyncHandler(async (req, res, next) => {
  // create path to image
  const filename = `${directorName}-${uuidv4()}-${Date.now()}.jpeg`
  const directorPath = path.join(__dirname, 'uploads', directorName)
  const filePath = path.join(directorPath, filename)

  // Ensure the directory exists
  if (!fs.existsSync(directorPath)) {
    fs.mkdirSync(directorPath, { recursive: true })
  }

  if (req.file) {
    // processing the image before uploading
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filePath)

    // save image into our database
    req.body.image = filename
    req.body.directorUrl = directorPath
    req.body.imageUrl = filePath
  }
  next()
})

module.exports = { resizeImage }