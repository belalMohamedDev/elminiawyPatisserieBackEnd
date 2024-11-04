const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const userModel = require("../../modules/userModel");

const creatToken = require("../../utils/generate token/createToken");

const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../utils/getDeviceInfo/getDeviceInfo");

const { uploadToCloudinary } = require("../../middleware/cloudinaryMiddleWare");
const { uploadSingleImage } = require("../../middleware/imageUploadMiddleware");
const { resizeImage } = require("../../middleware/resizeImage");

//upload single image
exports.uploadProfileImage = uploadSingleImage("image");

// resize image before upload
exports.resizeProfileImage = resizeImage();

// upload image in cloud
exports.uploadImageInCloud = uploadToCloudinary("driverProfile");

// @ dec sign Up
// @ route Post  /api/vi/auth/signUp
// @ access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const deviceInfo = JSON.stringify(getDeviceInfo(req));

  // create user
  const document = await userModel.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    storeAddress: req.body.storeAddress,
    image: req.body.image,
    publicId: req.body.publicId,
  });

  //generate token

  const refreshToken = creatToken(
    document._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  const accessToken = creatToken(
    document._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );

  (document.sessions = {
    refreshToken,
    deviceInfo,
    createdAt: new Date(),
    lastUsedAt: new Date(),
  }),
    document.save();



  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("userSuccessfullySignedUp"),
    accessToken: accessToken,
    data: sanitizeUser(document, refreshToken),
  });
});
