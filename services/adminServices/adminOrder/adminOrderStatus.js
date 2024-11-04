const OrderModel = require("../../../modules/orderModel");
const factory = require("../../handleFactor/handlerFactory");

// //  @dec  change order status to admin Approved
// //  @route  Put  /api/v1/orders/:orderId/approved
// //  @access Protect/admin
exports.passingOrderApprovedToReqBody = (req, res, next) => {
  req.body = { status: 1, adminAcceptedAt: Date.now() };
  next();
};

// //  @dec  change order status to Transit
// //  @route  Put  /api/v1/orders/:orderId/transit
// //  @access Protect/admin
exports.passingOrderTransitToReqBody = (req, res, next) => {
  req.body = { status: 2, adminCompletedAt: Date.now() };
  next();
};



// //  @dec  change order status
exports.orderUpdate = factory.updateOne(OrderModel, "user order");
