const asyncHandler = require("express-async-handler");
const CartModel = require("../../modules/cartModel");
const ProductModel = require("../../modules/productModel");

const i18n = require("i18n");

//  @dec    clear logged Cart item
//  @route  Delete  /api/v1/cart/clearItem/:itemId
//  @access Private/user
exports.clearLoggedUserCartItem = asyncHandler(async (req, res, next) => {
  // Find the cart of the logged-in user
  const cart = await CartModel.findOne({ user: req.userModel._id });

  // If the cart doesn't exist, return an error
  if (!cart) {
    return res.status(200).json({
      status: true,
      message: i18n.__("cartNotFound"),
      data: cart,
    });
  }

  // Clear the cart items
  cart.cartItems = [];
  cart.couponDiscount = 0;
  cart.totalCartPrice = 0;
  cart.totalPriceAfterDiscount = 0;
  cart.taxPrice = 0;
  cart.shippingPrice = 0;
  cart.totalOrderPrice = 0;

  // Save the updated cart
  await cart.save();

  // Return the response with the empty cart
  res.status(200).json({
    status: true,
    message: i18n.__("theCartIsNowEmpty"),
    data: cart,
  });
});
