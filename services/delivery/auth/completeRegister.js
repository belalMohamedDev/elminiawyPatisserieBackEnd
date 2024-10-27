const driverModel = require("../../../modules/driverModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const {
 uploadMultipleToCloudinary
} = require("../../../middleware/cloudinaryMiddleWare");

const {
uploadListOfImage
} = require("../../../middleware/imageUploadMiddleware");
const { resizeImage } = require("../../../middleware/resizeImage");


//upload muilt image
exports.uploadProductImage = uploadListOfImage("images");

// resize image before upload
exports.resizeProductImage = resizeImage();

// upload image in cloud
exports.uploadImageInCloud = uploadMultipleToCloudinary("driver");

//  @dec    complete Driver SignUp
//  @route  Get  /api/v1/driver/complete
//  @access Public
exports.completeDriverSignUp = asyncHandler(async (req, res) => {
  //this code to create
  const document = await driverModel.create(req.body);

  req.userModel.completeData = true;
  await req.userModel.save();

  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("successfullyCompleteAllData"),
    data: document,
  });
});
