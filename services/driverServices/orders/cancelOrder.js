const orderModel = require("../../../modules/orderModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

// @desc Cancel order by driver
// @route POST /api/v1/driver/canceledOrder
// @access Private to drivers
exports.canceledOrderByDrivers = asyncHandler(async (req, res) => {
   const orderId = req.params.orderId;

  const canceledOrder = await orderModel.findByIdAndUpdate(
    orderId,
    {
      $addToSet: { canceledByDrivers: req.userModel._id },
    },
    { new: true }
  );

  if (!canceledOrder) {
    return res.status(404).json({
      status: false,
      message: i18n.__("orderNotFound"),
    });
  }

  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToCancelOrders"),
  });
});
