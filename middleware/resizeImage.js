const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

// image processing
const resizeImage = () =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize(500)
        .toFormat("webp")
        .webp({ quality: 80 })
        .toBuffer();

      req.body.buffer = buffer;
      return next();
    } else {
      return next();
    }
  });

const resizeImages = () =>
  asyncHandler(async (req, res, next) => {
    if (req.files) {
      req.body.resizeImages = [];

      await Promise.all(
        Object.keys(req.files).map(async (fieldName) => {
          const images = req.files[fieldName];

          for (let image of images) {
            const buffer = await sharp(image.buffer)
              .resize(500)
              .toFormat("webp")
              .webp({ quality: 80 })
              .toBuffer();

            req.body.resizeImages.push({ fieldName, buffer });
          }
        })
      );
     
      return next();
    } else {
      return next();
    }
  });

module.exports = { resizeImage, resizeImages };
