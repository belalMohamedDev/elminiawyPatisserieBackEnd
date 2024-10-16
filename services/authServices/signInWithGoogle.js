const admin = require("firebase-admin");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const userModel = require("../../modules/userModel");
const ApiError = require("../../utils/apiFeatures/apiError");

const createToken = require("../../utils/generate token/createToken");
const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../utils/getDeviceInfo/getDeviceInfo");

// @desc sign in or sign up with Google
// @route Post  /api/v1/auth/google
// @access Public
exports.signInWithGoogle = asyncHandler(async (req, res, next) => {
  const idToken = req.body.token;

  const deviceInfo = JSON.stringify(getDeviceInfo(req));

  // Verify the Google ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  
  if (!decodedToken || decodedToken.email_verified === false) {
    return next(new ApiError(i18n.__('invalidGoogleTokenOrEmailNotVerified'), 400));
  }

  const email = decodedToken.email;
  const name = decodedToken.name || "Unknown Name"; // Default value if name is not provided by Google
  const phone = decodedToken.phone_number || null;

  // Check if user already exists
  let user = await userModel.findOne({ email: decodedToken.email });

  if (!user) {
    // If user doesn't exist, create a new user
    user = new userModel({
      name,
      phone,
      email,
      password: password || null, // Since password is not required for Google sign-in
    });

    // Save the new user
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
  
  // Save the updated user with session information
  await user.save();

  // Send success response
  res.status(201).json({
    status: true,
    message: i18n.__("signInWithGoogleSuccess"),
    accessToken: accessToken,
    data: sanitizeUser(user, refreshToken),
  });
});
