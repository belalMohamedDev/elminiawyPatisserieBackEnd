const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const i18n = require("i18n");

const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");

// @ dec access protect(user , admin  )
// make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //check if token exist , if exist get
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return next(new ApiError(i18n.__("notLoggedIn"), 422));
  }

  // verify token (no change happnes ,expired token)
  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY
  );

  //check  if user exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError(i18n.__("tokenLongerExists"), 422));
  }

  //check user active or no
  if (currentUser.active === false) {
    return next(new ApiError(i18n.__("accountInactive"), 422));
  }

  //check user active or no
  if (currentUser.role === "delivery") {
    if (!currentUser.driverActive) {
      return next(new ApiError(i18n.__("thisAccountIsNotYetActive"), 422));
    }
  }
  // check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // password changed after token created (error)
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(new ApiError(i18n.__("userRecentlyChangedPassword"), 422));
    }
  }

  //using in allowed permision
  req.userModel = currentUser;

  next();
});

////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// @ dec this fuction check role to user and access allowed data or no
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //access roles
    //access register user
    //check roles equal role with user
    if (!roles.includes(req.userModel.role)) {
      return next(new ApiError(i18n.__("notAllowedAccessRoute"), 403));
    }

    next();
  });

// @ dec access protect or no(user , admin  or driver)
// make sure the user is logged in or no
exports.protectOrNoProtected = asyncHandler(async (req, res, next) => {
  //check if token exist , if exist get
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return next();
  }

  // Decode token without verifying to check expiry
  const decodedToken = jwt.decode(accessToken);

  // Check if token is expired
  if (decodedToken && decodedToken.exp < Math.floor(Date.now() / 1000)) {
    return next(); // Proceed to the next middleware without user data
  }

  // verify token (no change happnes ,expired token)
  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        return next();
      }

      //check  if user exists
      const currentUser = await userModel.findById(decoded.userId);
      if (!currentUser) {
        return next();
      }

      //using in allowed permision
      req.userModel = currentUser;

      next();
    }
  );
});
