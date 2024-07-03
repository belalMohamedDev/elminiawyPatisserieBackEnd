const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");


// Function to delete an image from Cloudinary
const deleteImageFromCloudinary = asyncHandler(async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
});



module.exports = {
  deleteImageFromCloudinary,
};
