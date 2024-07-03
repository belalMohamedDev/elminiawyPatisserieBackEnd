
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// image processing
const resizeImage = (directorName) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `${directorName}-${uuidv4()}-${Date.now()}`;
      const directorPath = `uploads/${directorName}`;
      
      const buffer = await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: directorPath,
          public_id: filename,     
          //use_filename: true,
          unique_filename: false  
        },
        (error, result) => {
          if (error) {
            return next(new Error(`Upload to Cloudinary failed: ${error.message}`));
          } else {
            req.body.image = result.secure_url;
            req.body.publicId = result.public_id;
            return next();
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    } else {
      return next();
    }
  });

module.exports = { resizeImage };