const asyncHandler = require("express-async-handler");
const CouponModel = require("../../modules/couponModel");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");
const i18n = require("i18n");
const ProductModel = require("../../modules/productModel");

//  @desc    Apply coupon on logged user cart
//  @route   PUT /api/v1/cart/applyCoupon
//  @access  Private/user
exports.applyCouponOnLoggedUserCart = asyncHandler(async (req, res, next) => {
  // Validate coupon input
  if (!req.body.coupon) {
    return next(new ApiError(i18n.__("couponNameIsRequired"), 400));
  }

  // 1) Get coupon based on coupon name
  const coupon = await CouponModel.findOne({
    title: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(i18n.__("couponIsInvalidOrHasExpired"), 400));
  }

  // 2) Get logged user cart to get total price
  const cart = await CartModel.findOne({ user: req.userModel._id });

  if (!cart) {
    return next(new ApiError(i18n.__("cartNotFound"), 404));
  }

  if (cart.cartItems.length === 0) {
    return next(new ApiError(i18n.__("itemNotFoundInTheCart"), 404));
  }

  cart.couponDiscount = coupon.discount;

  // 4) Save updated cart
  await cart.save();

  // Helper function to localize product data
  var localizedDocument = ProductModel.schema.methods.toJSONLocalizedOnly(
    cart,
    req.headers["lang"] || "en"
  );

  // 5) Respond with updated cart data
  res.status(200).json({
    status: true,
    message: i18n.__("couponAppliedSuccessfully"),
    numOfCartItems: cart.cartItems.length,
    data: localizedDocument,
  });
});
