const asyncHandler = require('express-async-handler')
const CartModel = require('../../modules/cartModel')
const ApiError = require('../../utils/apiError/apiError')


//  @dec    update specific Cart item quantity
//  @route  Put  /api/v1/cart/:itemId
//  @access Private/user
exports.updateSpecificCartItemQuantity = asyncHandler(
    async (req, res, next) => {
      const { quantity } = req.body;
  
      const cart = await CartModel.findOne({ user: req.userModel._id });
  
      if (!cart) {
        return next(
          new ApiError(`there is no cart for this user id : ${req.userModel.id}`, 404)
        );
      }
  
      const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
      );
      if (itemIndex > -1) {
      
        cart.cartItems[itemIndex].quantity += quantity;

      } else {
        return next(
          new ApiError(
            `there is no item for this  id : ${req.params.itemId}`,
            404
          )
        );
      }
  
      await cart.save();
  
      res.status(200).json({
        status: true,
        message: "Successfully updated quantity of item in cart",
        numOfCartItems: cart.cartItems.length,
        data: cart,
      });
    }
  );