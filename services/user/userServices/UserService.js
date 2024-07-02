const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const {resizeImage} = require("../../../middleware/resizeImage");
const { uploadSingleImage } = require("../../../middleware/imageUploadMiddleware");
const { uploadToCloudinary } = require("../../../middleware/cloudinaryMiddleWare");

const factory = require("../../handleFactor/handlerFactory");

//upload single image
const uploadUserImage = uploadSingleImage("image");

// rssize image before upload
const resizeUserImage = resizeImage("user");


// upload image in cloud
const uploadImageInCloud = uploadToCloudinary();


// @ dec creat User
// @ route Post  /api/vi/user
// @ access private
const creatUser = factory.creatOne(userModel, "User");

// @ dec get all  User data
// @ route Get  /api/vi/ser
// @ access private
const getAllUser = factory.getAllData(userModel, "User");

// @ dec get specific User
// @ route Get  /api/vi/user/id
// @ access private
const getOneUser = factory.getOne(userModel, "User");

// @ dec delete specific User
// @ route Update  /api/vi/user/id
// @ access Private
const deleteUser = factory.deleteOne(userModel, "User");



// @ dec get logged user data
// @ route get  /api/vi/user/getMe
// @ access private/protect
const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.userModel._id;
  next();
});

// @ dec add logged user data in body
// @ access private/protect
const addLoggedUserDataInBody = asyncHandler(async (req, res, next) => {
  req.body.user = req.userModel._id;
  next();
});

module.exports = {
  creatUser,
  getAllUser,
  getOneUser,
  getLoggedUserData,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  uploadImageInCloud,
  addLoggedUserDataInBody
};
