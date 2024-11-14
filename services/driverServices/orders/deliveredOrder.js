const orderModel = require("../../../modules/orderModel");

const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

function toJSONLocalizedOnly(orders, lang) {
  return orders.map((order) => {
    // Localize user name
    if (order.user?.name && typeof order.user.name === "object") {
      order.user.name = order.user.name[lang] || order.user.name["en"];
    }

    // Localize cart items' product titles
    if (Array.isArray(order.cartItems)) {
      order.cartItems.forEach((item) => {
        if (item.product?.title && typeof item.product.title === "object") {
          const productTitle = item.product.title.toObject
            ? item.product.title.toObject()
            : item.product.title;
          item.product.title = productTitle[lang] || productTitle["en"];
        }
      });
    }

    // Localize shipping address region
    if (
      order.shippingAddress?.region &&
      typeof order.shippingAddress.region === "object"
    ) {
      const region = order.shippingAddress.region.toObject
        ? order.shippingAddress.region.toObject()
        : order.shippingAddress.region;
      order.shippingAddress.region = region[lang] || region["en"];
    }

    return order;
  });
}

//  @desc    Get list of delivered orders for the driver
//  @route   GET /api/v1/driver/deliveredOrder
//  @access  Private (driver)
exports.getAllDeliveredOrder = asyncHandler(async (req, res) => {
  let filter = req.filterObject || {};

  const apiFeatures = await orderModel.find(filter).lean();

  // Localize document data
  const localizedDocument = toJSONLocalizedOnly(
    apiFeatures,
    req.headers["lang"] || "en"
  );

  // Send success response with localized data
  res.status(200).json({
    status: true,
    message:
      i18n.__("SuccessToGetAllDataFor") + " " + i18n.__("deliveredOrder"),
    data: localizedDocument,
  });
});

//  @desc  Change order status to Delivered
//  @route PUT /api/v1/orders/:orderId/delivered
//  @access Protect/admin
exports.passingOrderDeliveredToReqBody = (req, res, next) => {
  req.body = {
    status: 4,
    isPaid: true,
    paidAt: Date.now(), // Corrected field name
  };
  next();
};

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

exports.createFilterObjectCancelledOrder = (req, res, next) => {
  let filterObject = {};
  filterObject = { canceledByDrivers: { $in: [req.userModel._id] } };
  req.filterObject = filterObject;
  next();
};
