const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const i18n = require("i18n");

const OrderModel = require("../../../modules/orderModel");
const CartModel = require("../../../modules/cartModel");
const ApiError = require("../../../utils/apiError/apiError");

//  @dec    create cash Order
//  @route  Post  /api/v1/orders/cardId
//  @access Protect/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  
  //1) get Cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(i18n.__("cartNotFound"), 404));

  }

  //3) create order with default payment method type cash
  const order = await OrderModel.create({
    user: req.userModel._id,
    notes: req.body.notes,
    cartItems: cart.cartItems,
    taxPrice: cart.taxPrice,
    shippingPrice: cart.shippingPrice,
    totalOrderPrice: cart.totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    //4) clear cart depend on cartId
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  res
    .status(200)
    .send({ status: true, message:i18n.__("orderCreatedSuccessfully") , data: order });
});

//  @dec    Get checkOut session from strip and send it as response
//  @route  Get  /api/v1/orders/checkOut-session/cartId
//  @access Protect/user
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get Cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this  id : ${req.params.cartId}`, 404)
    );
  }

  //2) get order price depend on cart price "check coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3) check strips checkOut session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.userModel.name,
        amount: totalOrderPrice * 100,
        currency: "egp",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.userModel.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4) send session to response
  res.status(200).send({ status: "success", session });
});
