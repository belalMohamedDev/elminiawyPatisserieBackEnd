const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

const {
  deleteImageFromCloudinary,
} = require("../../../middleware/cloudinaryMiddleWare");

// @ dec update logged user image
// @ route Update  /api/vi/user/updateMyImage
// @ access private/protect
exports.updateLoggedUserImage = asyncHandler(async (req, res, next) => {
  //update user data based user payload

  deleteImageFromCloudinary(req.userModel.publicId);

  req.userModel.image = req.body.image;
  req.userModel.publicId = req.body.publicId;

  await req.userModel.save();

  res.status(200).json({
    status: true,
    message: `Sucess To Update User image from this id.....`,
    data: sanitizeUser(req.userModel),
  });
});
