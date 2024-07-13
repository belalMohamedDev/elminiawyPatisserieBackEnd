const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");

// @ dec log out
// @ route Post  /api/vi/auth/logout
// @ access Public
exports.logOut = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokeRequired"), 400));
  }

  const user = await userModel.findOneAndUpdate(
    // { refreshToken },
    { _id: req.userModel._id },
    { refreshToken: null },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  res.status(201).json({
    status: true,
    message: i18n.__("loggedOutSuccessfully"),
  });
});
