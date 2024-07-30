const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");
const creatToken = require("../../utils/generate token/createToken");

// @ dec create new access token
// @ route Post  /api/vi/auth/token
// @ access Public
exports.newAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokeRequired"), 400));
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
  );

  const user = await userModel.findById(decoded.userId);

  verifySession(user,refreshToken);

  if (!user) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  const accessToken = creatToken(
    user._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  res.status(201).json({
    status: true,
    message: i18n.__("successCreateAccessToken"),
    accessToken: accessToken,
  });
});

const verifySession = async (user,refreshToken) => {
  const session = user.sessions.find(
    (session) => session.refreshToken === refreshToken
  );
  if (!session) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  session.lastUsedAt = new Date();
  await user.save();

};
