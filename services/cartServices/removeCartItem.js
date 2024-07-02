const asyncHandler = require("express-async-handler");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");

//  @dec    remove specific  Cart item
//  @route  Delete  /api/v1/cart/:itemId
//  @access Private/user

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  // Find the cart of the logged-in user
  const cart = await CartModel.findOne({ user: req.userModel._id });

  // If the cart doesn't exist, return an error
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // Check if the item exists in the cart
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(
      new ApiError(
        `Item not found in the cart for this id: ${req.params.itemId}`,
        404
      )
    );
  }

  // Remove the item from the cart
  cart.cartItems.splice(itemIndex, 1);

  // Save the updated cart
  await cart.save();

  // Return the response with the updated cart information
  res.status(200).json({
    status: true,
    message:
      cart.cartItems.length === 0
        ? "Successfully deleted logged user item from cart. The cart is now empty."
        : "Successfully deleted logged user item from cart",
    numOfCartItems: cart.cartItems.length === 0 ? 0 : cart.cartItems.length,
    data: cart,
  });
});
