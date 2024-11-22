const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");

// @ dec log out
// @ route Post  /api/vi/auth/logout
// @ access Public

exports.logOut = asyncHandler(async (req, res, next) => {
  let refreshToken;
  if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  } else if (req.cookies && req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokenRequired"), 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
  } catch (err) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  const user = await userModel.findOne({ _id: decoded.userId });

  if (!user) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  const sessionIndex = user.sessions.findIndex(
    (session) => session.refreshToken === refreshToken
  );

  if (sessionIndex === -1) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  user.sessions.splice(sessionIndex, 1);
  await user.save();

  res.clearCookie("accessToken", { httpOnly: true, secure: true });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });

  res.status(200).json({
    status: true,
    message: i18n.__("loggedOutSuccessfully"),
  });
});
