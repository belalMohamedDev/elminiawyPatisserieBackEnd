const asyncHandler = require("express-async-handler");
const CartModel = require("../../modules/cartModel");
const i18n = require("i18n");

//  @dec    clear logged Cart item
//  @route  Delete  /api/v1/cart/clearItem/:itemId
//  @access Private/user
exports.clearLoggedUserCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndDelete(
    { user: req.userModel._id },
    {
      $pull: { _id: req.params.itemId },
    },
    {
      new: true,
    }
  );

  // If the cart doesn't exist, return an error
  if (!cart) {
    return next(new ApiError(i18n.__("cartNotFound"), 404));
  }

  res.status(200).json({
    status: true,
    message: i18n.__("theCartIsNowEmpty"),
    data: cart,
  });
});
