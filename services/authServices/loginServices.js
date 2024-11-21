const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");
const creatToken = require("../../utils/generate token/createToken");
const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../utils/getDeviceInfo/getDeviceInfo");
const { addSessionToDB } = require("./addSessionToDB");

// @ dec login
// @ route Post  /api/vi/auth/login
// @ access Public
exports.login = asyncHandler(async (req, res, next) => {
  //check if user exist & check if password is correct
  const document = await userModel.findOne({ email: req.body.email });
  if (
    !document ||
    !(await bcrypt.compare(req.body.password, document.password))
  ) {
    return next(new ApiError(i18n.__("incorrectEmailOrPassword"), 400));
  }

  if (document.active == false) {
    return next(new ApiError(i18n.__("thisAccountNotActive"), 400));
  }

  const deviceInfo = JSON.stringify(getDeviceInfo(req));

  //generate token
  const accessToken = creatToken(
    document._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  const refreshToken = creatToken(
    document._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  await addSessionToDB(document._id, refreshToken, deviceInfo);

  // Remove old sessions if needed
  await removeOldSessions(document);

  //cookies to we
  const accessTokenMaxAge = parseTimeToMilliseconds(
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );
  const refreshTokenMaxAge = parseTimeToMilliseconds(
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: accessTokenMaxAge,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: refreshTokenMaxAge,
  });

  //send success response to client side
  res.status(201).json({
    status: true,
    message: i18n.__("successfulLoginIntoTheApp"),
    accessToken: accessToken,
    data: sanitizeUser(document, refreshToken),
  });
});

const removeOldSessions = async (user) => {
  const maxSessions = 5;

  if (user.sessions.length > maxSessions) {
    user.sessions.sort((a, b) => a.createdAt - b.createdAt);
    user.sessions = user.sessions.slice(-maxSessions);
    await user.save();
  }
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
