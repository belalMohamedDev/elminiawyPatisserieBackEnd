const orderModel = require("../../../modules/orderModel");
const driverModel = require("../../../modules/driverModel");
const storeAddressModel = require("../../../modules/storeAddressModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

// @desc Get all orders to drivers
// @route GET /api/v1/driver/getNewOrders
// @access Private to derivers

exports.getAllDriverOrders = asyncHandler(async (req, res) => {
  const driverData = await driverModel.findOne({
    user: req.userModel._id,
  });

  const branchesInRegion = await storeAddressModel.find({
      region: driverData.region,
    })
    .lean();

  const getAllOrders = await orderModel
    .find({
      nearbyStoreAddress: { $in: branchesInRegion.map((branch) => branch._id) },
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
