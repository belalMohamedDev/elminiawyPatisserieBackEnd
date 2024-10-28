const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const factory = require("../handleFactor/handlerFactory");

exports.createFilterObjectToGetAllActiveDriver = (req, res, next) => {
  req.filterObject = {
    deliveryActive: false,
    completeData: true,
  };
  next();
};

// @ dec get all not active user driver
// @ route Get  /api/vi/driver/allDriverNotActive
// @ access Private to admin
exports.getAllNotActiveUserDriver = factory.getAllData(userModel, "userDriver");

// //  @dec    complete Driver SignUp
// //  @route  Get  /api/v1/driver/complete
// //  @access Public
// exports.completeDriverSignUp = asyncHandler(async (req, res) => {
//   //this code to create
//   const document = await driverModel.create(req.body);

//   req.userModel.completeData = true;
//   await req.userModel.save();

//   //send success response
//   res.status(201).json({
//     status: true,
//     message: i18n.__("successfullyCompleteAllData"),
//     data: document,
//   });
// });
