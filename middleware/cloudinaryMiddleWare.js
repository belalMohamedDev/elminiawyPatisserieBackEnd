const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const ApiError = require("../utils/apiError/apiError");

// Function to delete an image from Cloudinary
const deleteImageFromCloudinary = asyncHandler(async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
});

//Middleware to upload an image to Cloudinary

const uploadToCloudinary = () =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filePath = path.join(req.body.imageUrl);
      if (fs.existsSync(filePath)) {
        cloudinary.uploader.upload(
          filePath,
          {
            folder: req.body.directorUrl,
            use_filename: true,
          },
          (error, result) => {
            if (result) {
              fs.unlink(filePath, (err) => {
                if (err) {
                  return next(new ApiError("only images are allowed", 400));
                } else {
                  req.body.image = result.url;
                  req.body.publicId = result.public_id; 
                  return next();
                }
              });
            } else {
              fs.unlink(filePath, () => {});
              return next(
                new ApiError(
                  `upload image error try again ${error.message}`,
                  400
                )
              );
            }
          }
        );
      } else {
        return next(new ApiError("File path does not exist", 400));
      }
    } else {
      next();
    }
  });

module.exports = {
  uploadToCloudinary,
  deleteImageFromCloudinary,
};
