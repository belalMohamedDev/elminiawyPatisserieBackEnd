const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const ProductModel = require("../../modules/productModel");
const CartModel = require("../../modules/cartModel");

// @ dec get logged user cart
// @ route Get  /api/vi/cart
// @ access private/user

// // Helper function to check if two arrays of objects are equal
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.userModel._id });

  //check found data or no
  if (!cart) {
    return res.status(200).json({
      status: true,
      message: i18n.__("thereIsNoCartForThisUser"),
      numOfCartItems: 0,
      data: {
        cartItems: [], 
      },
    });
  }

  // Helper function to localize product data
  var localizedDocument = ProductModel.schema.methods.toJSONLocalizedOnly(
    cart,
    req.headers["lang"] || "en"
  );

  res.status(200).json({
    status: true,
    message: i18n.__("successfullyGetLoggedUserData"),
    numOfCartItems: cart.cartItems.length,
    data: localizedDocument,
  });
});
