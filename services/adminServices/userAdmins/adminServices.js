const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

// @desc Get all active user ADMINS
// @route GET /api/v1/admin
// @access Private to admin
exports.getActiveAdmin = asyncHandler(async (req, res) => {
  const document = await userModel.find({
    role: "admin",
    active: true,
  });

  //send success response
  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllDataFor") + i18n.__("admin"),
    data: sanitizeUser(document),
  });
});


// @desc Get all inactive user drivers
// @route GET /api/v1/admin/inactive
// @access Private to admin
exports.getInActiveAdmin = asyncHandler(async (req, res) => {
  const document = await userModel.find({
    role: "admin",
    active: false,
  });

  //send success response
  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllDataFor") + i18n.__("admin"),
    data: sanitizeUser(document),
  });
});
