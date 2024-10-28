const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const streamifier = require("streamifier");

// Function to delete an image from Cloudinary
const deleteImageFromCloudinary = asyncHandler(async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
});

//Middleware to upload an image to Cloudinary

const uploadToCloudinary = (directorName) =>
  asyncHandler(async (req, res, next) => {
    const directorPath = `uploads/${directorName}`;

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: directorPath,
        },
        (error, result) => {
          if (error) {
            return next(
              new Error(`Upload to Cloudinary failed: ${error.message}`)
            );
          } else {
            req.body.image = result.secure_url;
            req.body.publicId = result.public_id;
            return next();
          }
        }
      );

      streamifier.createReadStream(req.body.buffer).pipe(uploadStream);
    } else {
      return next();
    }
  });



const uploadMultipleToCloudinary = (directorName) =>
  asyncHandler(async (req, res, next) => {
    const directorPath = `uploads/${directorName}`;
    req.body.images = req.body.images || [];
    req.body.publicIds = req.body.publicIds || [];

    if (req.body.resizeImages && req.body.resizeImages.length > 0) {
      const uploadPromises = req.body.resizeImages.map(({ buffer }) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: directorPath,
            },
            (error, result) => {
              if (error) {
                reject(`Upload to Cloudinary failed: ${error.message}`);
              } else {
                req.body.images.push(result.secure_url);
                req.body.publicIds.push(result.public_id);
                resolve();
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(uploadStream);
        });
      });

      await Promise.all(uploadPromises);
    }

    next();
  });

module.exports = { uploadMultipleToCloudinary };


module.exports = {
  uploadToCloudinary,
  deleteImageFromCloudinary,
  uploadMultipleToCloudinary
};
