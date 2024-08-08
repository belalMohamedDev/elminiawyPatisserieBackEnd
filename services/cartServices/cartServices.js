const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const ProductModel = require("../../modules/productModel");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");

// @ dec Add product to  cart
// @ route Post  /api/vi/cart
// @ access private/user

// // Helper function to check if two arrays of objects are equal
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { product, quantity } = req.body;

  const productObject = await ProductModel.findById(product);

  //check found data or no
  if (!productObject) {
    //send faild response
    return next(
      new ApiError(i18n.__("faildToGetProductData"), 404)
    );
  }

  //get cart for logged user
  let cart = await CartModel.findOne({ user: req.userModel._id });
  if (!cart) {
    cart = new CartModel({
      user: req.userModel._id,
      cartItems: [
        {
          product: productObject._id,
          quantity: quantity,
          price: productObject.price,
        },
      ],
    });
  } else {
    const existingItemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productObject._id.toString() &&
        item.price === productObject.price
    );

    if (existingItemIndex > -1) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        product: productObject._id,
        quantity: quantity,
        price: productObject.price,
      });
    }
  }

  await cart.save();
  res.status(200).json({
    status: true,
    message: i18n.__("protuctAddedCartSuccessfully"),
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
