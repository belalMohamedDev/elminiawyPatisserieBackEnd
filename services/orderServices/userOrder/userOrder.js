const OrderModel = require("../../../modules/orderModel");
const factory = require("../../handleFactor/handlerFactory");

// //  @dec  get all complete order and cancelled to user
// //  @route  Get /api/v1/orders/user
// //  @access Protect/user
exports.createFilterObjectToGetAllCompleteUserOrder = (req, res, next) => {
  let filterObject = {};
  filterObject = {
    user: req.userModel._id,
    status: { $in: ["Delivered", "Cancelled"] },
  };
  req.filterObject = filterObject;
  next();
};

// //  @dec  get all pending order to user
// //  @route  Get /api/v1/orders/user/pending
// //  @access Protect/user
exports.createFilterObjectToGetAllPendingUserOrder = (req, res, next) => {
  let filterObject = {};
  filterObject = {
    user: req.userModel._id,
    status: { $ne: ["Delivered", "Cancelled"] },
  };
  req.filterObject = filterObject;
  next();
};

// //  @dec  get all  order to user
exports.getAllUserOrder = factory.getAllData(OrderModel, "user order");



exports.passingOrderCancelledToReqBody = (req, res, next) => {
  req.body = { status: "Cancelled" };

  next();
};

// //  @dec  change order status to Cancelled
// //  @route  Put  /api/v1/orders/:id/Cancelled
// //  @access Protect/user
exports.orderCancelled = factory.updateOne(OrderModel, "user order");
