
const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

const i18n = require("i18n");


// @ dec update logged user data
// @ route Update  /api/vi/user/updateMyData
// @ access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {

    //update user data based user payload
    const document = await userModel.findByIdAndUpdate(
      req.userModel._id,
      {
        name: req.body.name,
        phone: req.body.phone,
      },
      { new: true }
    );
  
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToUpdateDataFromThisId"),
      data: sanitizeUser(document,document.refreshToken),
    });
  });
  