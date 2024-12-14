const driverModel = require("../../../modules/driverModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");

const i18n = require("i18n");

const {
  uploadMultipleToCloudinary,
} = require("../../../middleware/cloudinaryMiddleWare");

const {
  uploadListOfImage,
} = require("../../../middleware/imageUploadMiddleware");
const { resizeImages } = require("../../../middleware/resizeImage");

//upload muilt image
exports.uploadDriverIdsImages = uploadListOfImage([
  {
    name: "images",
    maxCount: 5,
  },
]);

// resize image before upload
exports.resizeDriverIdsImages = resizeImages();

// upload image in cloud
exports.uploadDriversImageIdInCloud = uploadMultipleToCloudinary("driverId");

//  @dec    complete Driver SignUp
//  @route  Get  /api/v1/driver/complete
//  @access Protected to driver
exports.completeDriverSignUp = asyncHandler(async (req, res, next) => {
  //this code to create
  const document = await driverModel.create(req.body);

  req.userModel.completeData = true;

  req.userModel.driverActive = false;

  req.userModel.driverRegion = req.body.region;

  req.userModel.sessions.splice(0, 1);

  await req.userModel.save();

  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("successfullyCompleteAllData"),
    data: document,
  });
});
