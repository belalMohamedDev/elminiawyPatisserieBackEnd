const orderModel = require("../../../modules/orderModel");
const driverModel = require("../../../modules/driverModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

// @desc Get all orders to drivers
// @route GET /api/v1/driver/getNewOrders
// @access Private to derivers
exports.getAllDriverOrders = asyncHandler(async (req, res) => {
  const driverData = await driverModel.findOne({
    user: req.userModel._id,
  });

  const getAllOrders = await orderModel
    .find({
      orderRegion: driverData.region,
      status: 2,
      canceledByDrivers: { $ne: req.userModel._id },
    })
    .limit(5)
    .lean();

  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllOrders"),
    data: getAllOrders,
  });
});
