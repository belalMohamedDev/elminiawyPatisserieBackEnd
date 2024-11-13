const orderModel = require("../../../modules/orderModel");
const factory = require("../../handleFactor/handlerFactory");

// //  @dec  change order status to Delivered
// //  @route  Put  /api/v1/orders/:orderId/delivered
// //  @access Protect/admin
exports.passingOrderDeliveredToReqBody = (req, res, next) => {
  req.body = {
    status: 4,
    isPaid: true,
    paitAt: Date.now(),
  };

  next();
};

//  @dec    get list of delivered order to driver
//  @route  Get  /api/v1/driver/deliveredOrder
//  @access Private (driver)
exports.getAllDeliveredOrder = factory.getAllData(
  orderModel,
  "delivered order"
);

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
   filterObject = { status: 4, driverId: req.userModel._id };
  req.filterObject = filterObject;
  next();
};


exports.createFilterObjectAcceptedOrder = (req, res, next) => {
  let filterObject = {};
  filterObject = { status: 3, driverId: req.userModel._id };
  req.filterObject = filterObject;
  next();
};
