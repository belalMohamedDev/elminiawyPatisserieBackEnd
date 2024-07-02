const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const storeAddressModel = require("../../../modules/storeAddressModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  get all pending  order to admin
// //  @route  Get /api/v1/orders/admin/pending
// //  @access private/admin
exports.getAllPendingAdminOrder = asyncHandler(async (req, res, next) => {
  const { maxDistance } = req.body;

  const distanceInMeters = maxDistance ? maxDistance * 1000 : 5000;

  const getBranchAdminAddress = await storeAddressModel.findById(
    req.userModel.branchAddress
  );

  if (!getBranchAdminAddress) {
    //send faild response
    return next(new ApiError(`Store address for admin not found`, 404));
  }

  const pendingAdminOrders = await OrderModel.find({
    status: { $in: ["Pending", "Admin Approved", "In Transit"] },
    "shippingAddress.location": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            getBranchAdminAddress.longitude,
            getBranchAdminAddress.latitude,
          ],
        },
        $maxDistance: distanceInMeters,
      },
    },
  }).sort({ status: 1 });

  if (!pendingAdminOrders || pendingAdminOrders.length === 0) {
    return next(
      new ApiError(`There are no orders that have been pending to admin`, 404)
    );
  }

  res.status(200).send({
    status: true,
    message: "Successfully retrieved all pending orders for admin",
    data: pendingAdminOrders,
  });
});

// //  @dec  get all admin order
// //  @route  Get /api/v1/orders/admin
// //  @access private/admin
exports.getAllAdminCompleteOrder = asyncHandler(async (req, res, next) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const compeleteAdminOrders = await OrderModel.find({
    status: { $in: ["Delivered", "Cancelled"] },
    createdAt: { $gte: start, $lte: end },
    "shippingAddress.location": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            getBranchAdminAddress.longitude,
            getBranchAdminAddress.latitude,
          ],
        },
        $maxDistance: distanceInMeters,
      },
    },
  }).sort({ status: 1 });

  if (compeleteAdminOrders.length === 0) {
    return next(
      new ApiError(`There are no orders within the specified period.`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: compeleteAdminOrders,
  });
});
