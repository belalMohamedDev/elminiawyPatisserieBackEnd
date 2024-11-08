const orderModel = require("../../../modules/orderModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

function toJSONLocalizedOnly(order, lang) {
  // Create a deep copy to avoid mutating the original order object
  const localizedOrder = JSON.parse(JSON.stringify(order));

  // Localize user name if it's an object
  if (
    localizedOrder.user &&
    localizedOrder.user.name &&
    typeof localizedOrder.user.name === "object"
  ) {
    localizedOrder.user.name =
      localizedOrder.user.name[lang] || localizedOrder.user.name["en"];
  }

  // Localize product titles in cartItems
  if (localizedOrder.cartItems && Array.isArray(localizedOrder.cartItems)) {
    localizedOrder.cartItems.forEach((item) => {
      if (
        item.product &&
        item.product.title &&
        typeof item.product.title === "object"
      ) {
        item.product.title =
          item.product.title[lang] || item.product.title["en"];
      }
    });
  }

  // Localize region in shippingAddress
  if (
    localizedOrder.shippingAddress &&
    localizedOrder.shippingAddress.region &&
    typeof localizedOrder.shippingAddress.region === "object"
  ) {
    localizedOrder.shippingAddress.region =
      localizedOrder.shippingAddress.region[lang] ||
      localizedOrder.shippingAddress.region["en"];
  }

  return localizedOrder;
}

// @desc Accept order by driver
// @route POST /api/v1/driver/:orderId/accept
// @access Private to drivers
exports.acceptedOrderByDrivers = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.userModel._id; // Access driver ID directly

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

  // Localize the document based on the preferred language
  const localizedDocument = toJSONLocalizedOnly(
    order,
    req.headers["lang"] || "en"
  );

  res.status(200).json({
    status: true,
    message: i18n.__("orderAccepted"),
    data: localizedDocument,
  });
});
