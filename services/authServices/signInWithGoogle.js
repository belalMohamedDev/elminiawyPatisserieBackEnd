const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const userModel = require("../../modules/userModel");

const createToken = require("../../utils/generate token/createToken");
const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../utils/getDeviceInfo/getDeviceInfo");

// @desc sign in or sign up with Google
// @route Post  /api/v1/auth/google
// @access Publi
exports.signInWithGoogle = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const name = req.body.name;
  const role = req.body.role;

  const deviceInfo = JSON.stringify(getDeviceInfo(req));

  // Check if user already exists
  let user = await userModel.findOne({ email: email });

  if (!user) {
    // If user doesn't exist, create a new user
    user = new userModel({
      name,
      phone,
      email,
      role,
    });
    await user.save();
  }

  // Generate tokens
  const refreshToken = createToken(
    user._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  const accessToken = createToken(
    user._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  // Add session to user
  (user.sessions = {
    refreshToken,
    deviceInfo,
    createdAt: new Date(),
    lastUsedAt: new Date(),
  }),
    await user.save();

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
  // Send success response
  res.status(201).json({
    status: true,
    message: i18n.__("signInWithGoogleSuccess"),
    accessToken: accessToken,
    data: sanitizeUser(user, refreshToken),
  });
});


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