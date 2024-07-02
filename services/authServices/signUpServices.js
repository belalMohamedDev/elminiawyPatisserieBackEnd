const asyncHandler = require("express-async-handler");

const userModel = require("../../modules/userModel");

const creatToken = require("../../utils/generate token/createToken");

const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");

// @ dec sign Up
// @ route Post  /api/vi/auth/signUp
// @ access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  // create user
  const document = await userModel.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

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

  document.refreshToken = refreshToken;
  await document.save();
  //send success response
  res.status(201).json({
    status: true,
    message: `User successfully signed up`,
    accessToken: accessToken,
    data: sanitizeUser(document),
  });
});
