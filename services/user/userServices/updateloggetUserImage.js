const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");



// @ dec update logged user image
// @ route Update  /api/vi/user/updateMyImage
// @ access private/protect
exports.updateLoggedUserImage = asyncHandler(async (req, res, next) => {
  //update user data based user payload

  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      image: req.body.image,
      publicId: req.body.publicId,
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: `Sucess To Update User image from this id.....`,
    data: sanitizeUser(document),
  });
});
