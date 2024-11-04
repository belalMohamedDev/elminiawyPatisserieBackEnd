const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

// @desc Get all inactive user drivers
// @route GET /api/v1/driver/allDriverNotActive
// @access Private to admin
exports.getAllNotActiveUserDriver = asyncHandler(async (req, res) => {
  const document = await userModel.find({
    deliveryActive: false,
    completeData: true,
  });

  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("SuccessToGetAllDataFor") + i18n.__("driver"),
    data: sanitizeUser(document),
  });
});

// @ dec  active user driver
// @ route Get  /api/vi/driver/:id/active
// @ access Private to admin
exports.activeDriverAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //this code update data from db using id
  const document = await userModel.findOneAndUpdate(
    { _id: id },
    {
      driverActive: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //check found data or no
  if (!document) {
    //send faild response
    return next(
      new ApiError(i18n.__("failedToUpdateDataById", i18n.__("driver")), 404)
    );
  }



  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("SucessToUpdateDataFromThisId"),
    data: sanitizeUser(document),
  });
});
