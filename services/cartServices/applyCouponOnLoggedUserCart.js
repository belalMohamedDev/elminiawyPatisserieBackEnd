const asyncHandler = require('express-async-handler')
const CouponModel = require('../../modules/couponModel')
const CartModel = require('../../modules/cartModel')
const ApiError = require('../../utils/apiError/apiError')


//  @desc    Apply coupon on logged user cart
//  @route   PUT /api/v1/cart/applyCoupon
//  @access  Private/user
exports.applyCouponOnLoggedUserCart = asyncHandler(async (req, res, next) => {
  // Validate coupon input
  if (!req.body.coupon) {
    return next(new ApiError('Coupon name is required', 400));
  }

  // 1) Get coupon based on coupon name
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError('Coupon is invalid or has expired', 400));
  }

  // 2) Get logged user cart to get total price
  const cart = await CartModel.findOne({ user: req.userModel._id });

  if (!cart) {
    return next(new ApiError(`No cart found for user id: ${req.userModel._id}`, 404));
  }

  if (cart.cartItems.length === 0) {
    return next(new ApiError(`No items in the cart for user id: ${req.userModel._id}`, 404));
  }

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after discount
  const discount = (coupon.discount * totalPrice) / 100;
  const totalPriceAfterDiscount = parseFloat((totalPrice - discount).toFixed(2));
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  // 4) Save updated cart
  await cart.save();

  // 5) Respond with updated cart data
  res.status(200).json({
    status: true,
    message: "Coupon applied successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});