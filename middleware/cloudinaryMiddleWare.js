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

module.exports = {
  uploadToCloudinary,
  deleteImageFromCloudinary,
};
