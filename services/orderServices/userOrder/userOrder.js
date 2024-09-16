const OrderModel = require("../../../modules/orderModel");
const productModel = require("../../../modules/productModel");
const factory = require("../../handleFactor/handlerFactory");

// @desc Get all completed orders for a user
// @route GET /api/v1/orders/user/completed
// @access Protect/user
exports.createFilterObjectToGetAllCompleteUserOrder = (req, res, next) => {
  req.filterObject = {
    user: req.userModel._id,
    status: { $in: [3, 4] },
  };
  next();
};

// @desc Get all pending orders for a user
// @route GET /api/v1/orders/user/pending
// @access Protect/user
exports.createFilterObjectToGetAllPendingUserOrder = (req, res, next) => {
  req.filterObject = {
    user: req.userModel._id,
    status: { $nin: [3, 4] },
  };
  next();
};


// //  @dec  get all  order to user
exports.getAllUserOrder = factory.getAllData(OrderModel, "user order",productModel);



exports.passingOrderCancelledToReqBody = (req, res, next) => {
  req.body = { status: 4 };

  next();
};

// //  @dec  change order status to Cancelled
// //  @route  Put  /api/v1/orders/:id/Cancelled
// //  @access Protect/user
exports.orderCancelled = factory.updateOne(OrderModel, "user order",productModel);
