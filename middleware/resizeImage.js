const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// image processing
const resizeImage = (directorName) => asyncHandler(async (req, res, next) => {
  // create path to image
  const filename = `${directorName}-${uuidv4()}-${Date.now()}.jpeg`
  const directorPath = path.join('uploads', directorName)
  const filePath = path.join(directorPath, filename)

  // Ensure the directory exists
  fs.mkdir(directorPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err)
    } else {
      // processing the image before uploading
      if (req.file) {
        sharp(req.file.buffer)
          .resize(600, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(filePath, (err) => {
            if (err) {
              console.error('Error resizing and saving image:', err)
            } else {
              // save image into our database
              req.body.image = filename
              req.body.directorUrl = directorPath
              req.body.imageUrl = filePath
            }
            next()
          })
      } else {
        next()
      }
    }
  })
})

module.exports = { resizeImage }