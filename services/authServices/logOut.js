const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");

// @ dec log out
// @ route Post  /api/vi/auth/logout
// @ access Public

exports.logOut = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokenRequired"), 400));
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
  );

  const user = await userModel.findOne({ _id: decoded.userId });

  if (!user) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  // Verify and remove session
  const sessionIndex = user.sessions.findIndex(
    (session) => session.refreshToken === refreshToken
  );

  if (sessionIndex === -1) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  user.sessions.splice(sessionIndex, 1);
  await user.save();



  res.status(200).json({
    status: true,
    message: i18n.__("loggedOutSuccessfully"),
  });
});
