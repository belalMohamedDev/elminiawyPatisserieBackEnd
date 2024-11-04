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
