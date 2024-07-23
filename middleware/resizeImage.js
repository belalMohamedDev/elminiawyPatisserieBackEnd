const asyncHandler = require("express-async-handler");
const sharp = require("sharp");


// image processing
const resizeImage = () =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .toFormat("png")
        .png({ quality: 100 })
        .toBuffer();

      req.body.buffer = buffer;
      return next();
    } else {
      return next();
    }
  });

module.exports = { resizeImage };
