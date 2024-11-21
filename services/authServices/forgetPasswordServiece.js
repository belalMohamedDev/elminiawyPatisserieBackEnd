const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const i18n = require("i18n");
const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");
const sendEmail = require("../../utils/sendEmail/sendEmail");
const creatToken = require("../../utils/generate token/createToken");
const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../utils/getDeviceInfo/getDeviceInfo");

/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// @ dec forget password
// @ route Post  /api/vi/auth/forgetPassword
// @ access Public

const forgetPassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const document = await userModel.findOne({ email: req.body.email });

  if (!document) {
    return next(new ApiError(i18n.__("noUserHasThisEmail"), 404));
  }

  // if user exist ,generate hash random 6 digits and save it in db
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashRestCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");

  //save hashed password reset code into db
  document.passwordRestCode = hashRestCode;
  //add expiration time for password rest code (10 min)
  document.passwordRestExpire = Date.now() + 10 * 60 * 1000;
  document.passwordRestVerified = false;

  await document.save();

  const message = `

  Hello ${document.name},

  Click on this icon to complete the password reset.
  
  ${restCode}

  If you did not request this PIN, we recommend that you change your password on elminiawy patisserie App.
  
  Go to Settings & privacy > Sign-in & security > Change password
  
  Your account must be more secure, and you must also:
  
  A common technique in two-step verification
  
  Settings & privacy > Sign in & security > Two-step verification
  
  Check the site you're signed in from
  
  Settings & privacy > Sign in & security > Where you're signed in
  
  Thank you for helping us and the security of your account.
  
  elminiawy patisserie App Team
 
  `;

  // send the reset code via email
  try {
    sendEmail({
      to: document.email,
      subject: `${document.name}, this is your ID code ${restCode}`,
      text: message,
    });
  } catch (error) {
    document.passwordRestCode = undefined;
    document.passwordRestExpire = undefined;
    document.passwordRestVerified = undefined;

    await document.save();
    return next(new ApiError(i18n.__("ErrorSendingEmail"), 409));
  }

  //send success response to client side
  res.status(201).json({
    status: true,
    message: i18n.__("sendRestCodeEmail"),
  });
});

/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// @ dec verify Reset Code
// @ route Post  /api/vi/auth/verifyCode
// @ access Public
const verifyCode = asyncHandler(async (req, res, next) => {
  //get user based on  rest code
  const hashRestCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  //get user by password Rest Code and password Rest Expire
  const document = await userModel.findOne({
    passwordRestCode: hashRestCode,
    passwordRestExpire: { $gt: Date.now() },
  });

  if (!document) {
    return next(new ApiError(i18n.__("InvalidOrExpired"), 404));
  }

  // reset code valid
  document.passwordRestVerified = true;
  await document.save();

  //send success response to client side
  res.status(201).json({
    status: true,
    message: i18n.__("verifiedSuccessfully"),
  });
});

/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// @ dec  Reset password
// @ route Post  /api/vi/auth/resetPassword
// @ access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const deviceInfo = JSON.stringify(getDeviceInfo(req));

  //get user based on  email
  const document = await userModel.findOne({
    email: req.body.email,
  });

  if (!document) {
    return next(new ApiError(i18n.__("noUserHasThisEmail"), 404));
  }

  //check if rest code verified
  if (!document.passwordRestVerified) {
    return next(new ApiError(i18n.__("restCodeVerified"), 422));
  }

  // update password
  document.password = req.body.newPassword;
  document.passwordRestCode = undefined;
  document.passwordRestExpire = undefined;
  document.passwordRestVerified = undefined;

  // if everyThing is ok  generate token

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

  (document.sessions = {
    refreshToken,
    deviceInfo,
    createdAt: new Date(),
    lastUsedAt: new Date(),
  }),
    await document.save();

  //cookies to we
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: process.env.JWT_EXPIER_ACCESS_TIME_TOKEN,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: process.env.JWT_EXPIER_REFRESH_TIME_TOKEN,
  });

  //send success response to client side
  res.status(201).json({
    status: true,
    message: i18n.__("successfullyUpdatingPassword"),
    accessToken: accessToken,
    data: sanitizeUser(document),
  });
});

module.exports = {
  forgetPassword,
  verifyCode,
  resetPassword,
};
