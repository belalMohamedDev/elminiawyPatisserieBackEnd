const OrderModel = require("../../../modules/orderModel");
const factory = require("../../handleFactor/handlerFactory");

// //  @dec  change order status to admin Approved
// //  @route  Put  /api/v1/orders/:orderId/approved
// //  @access Protect/admin
exports.passingOrderApprovedToReqBody = (req, res, next) => {
  req.body = { status: "Admin Approved" };
  next();
};

// //  @dec  change order status to Transit
// //  @route  Put  /api/v1/orders/:orderId/transit
// //  @access Protect/admin
exports.passingOrderTransitToReqBody = (req, res, next) => {
  req.body = { status: "In Transit" };
  next();
};

// //  @dec  change order status to Delivered
// //  @route  Put  /api/v1/orders/:orderId/delivered
// //  @access Protect/admin
exports.passingOrderDeliveredToReqBody = (req, res, next) => {
  req.body = {
    status: "Delivered",
    isPaid: true,
    paitAt: Date.now(),
  };

  next();
};

// //  @dec  change order status
exports.orderUpdate = factory.updateOne(OrderModel, "user order");
