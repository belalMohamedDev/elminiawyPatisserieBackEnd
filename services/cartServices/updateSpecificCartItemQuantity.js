const asyncHandler = require("express-async-handler");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");
const i18n = require("i18n");
const ProductModel = require("../../modules/productModel");

//  @dec    update specific Cart item quantity
//  @route  Put  /api/v1/cart/:itemId
//  @access Private/user
exports.updateSpecificCartItemQuantity = asyncHandler(
  async (req, res, next) => {
    const { quantity } = req.body;

    if (quantity === 0) {
      return next(new ApiError(i18n.__("quantityShouldBeAtLeast"), 400));
    }

    const cart = await CartModel.findOne({ user: req.userModel._id });

    if (!cart) {
      return next(new ApiError(i18n.__("cartNotFound"), 404));
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += quantity;

      if (cart.cartItems[itemIndex].quantity <= 0) {
        cart.cartItems[itemIndex].quantity = 1;
      }
    } else {
      return next(new ApiError(i18n.__("itemNotFoundInTheCart"), 404));
    }

    await cart.save();

    // Helper function to localize product data
    var localizedDocument = ProductModel.schema.methods.toJSONLocalizedOnly(
      cart,
      req.headers["lang"] || "en"
    );

    res.status(200).json({
      status: true,
      message: i18n.__("successfullyUpdatedQuantityOfItemInCart"),
      numOfCartItems: cart.cartItems.length,
      data: localizedDocument,
    });
  }
);
