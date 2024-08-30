const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const ProductModel = require("../../modules/productModel");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");

// @desc Add product to cart
// @route POST /api/v1/cart
// @access Private/User

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { product, quantity } = req.body;

  // Find the product by ID
  const productObject = await ProductModel.findById(product);

  // Check if product exists
  if (!productObject) {
    return next(new ApiError(i18n.__("faildToGetProductData"), 404));
  }

  // Get the cart for the logged-in user
  let cart = await CartModel.findOne({ user: req.userModel._id });

  // If no cart exists, create a new one
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
    // Check if the product already exists in the cart
    const existingItemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productObject._id.toString() &&
        item.price === productObject.price
    );

    // If the product is already in the cart, update its quantity
    if (existingItemIndex > -1) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Otherwise, add a new cart item
      cart.cartItems.push({
        product: productObject._id,
        quantity: quantity,
        price: productObject.price,
      });
    }
  }

  // Save the cart
  await cart.save();

  // Explicitly populate after saving
  await cart.populate({
    path: "cartItems.product",
    select: "title image ratingsAverage",
  });

  // Helper function to localize product data
  var localizedDocument = ProductModel.schema.methods.toJSONLocalizedOnly(
    cart,
    req.headers["lang"] || "en"
  );

  // Send the response
  res.status(200).json({
    status: true,
    message: i18n.__("protuctAddedCartSuccessfully"),
    numOfCartItems: cart.cartItems.length,
    data: localizedDocument,
  });
});
