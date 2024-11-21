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
  let refreshToken;

  if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  } else if (req.cookies && req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  } else if (req.headers.authorization) {
    refreshToken = req.headers.authorization.split(" ")[1];
  }

  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokeRequired"), 400));
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
  );

  const user = await userModel.findById(decoded.userId);

  verifySession(user, refreshToken);

  if (!user) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  const accessToken = creatToken(
    user._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  //cookies to we
  const accessTokenMaxAge = parseTimeToMilliseconds(
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: accessTokenMaxAge,
  });

  res.status(201).json({
    status: true,
    message: i18n.__("successCreateAccessToken"),
    accessToken: accessToken,
  });
});

const verifySession = async (user, refreshToken) => {
  const session = user.sessions.find(
    (session) => session.refreshToken === refreshToken
  );
  if (!session) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  session.lastUsedAt = new Date();
  await user.save();
};

const parseTimeToMilliseconds = (time) => {
  const unit = time.slice(-1); // m, d
  const value = parseInt(time.slice(0, -1), 10);
  switch (unit) {
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid time format");
  }
};
