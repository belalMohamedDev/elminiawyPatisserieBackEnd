
const orderModel = require("../../../modules/orderModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

// @desc Accept order by driver
// @route POST /api/v1/driver/:orderId/accept
// @access Private to drivers
exports.acceptedOrderByDrivers = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { driverId } = req.userModel._id;

  const order = await orderModel.findOneAndUpdate(
    { _id: orderId, status: 2 },
    { status: 3, driverId, driverAcceptedAt: Date.now() },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({
      status: false,
      message: i18n.__("orderNotFoundOrAlreadyAccepted"),
    });
  }

  res.status(200).json({
    status: true,
    message: i18n.__("orderAccepted"),
  });
});
