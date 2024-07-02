const asyncHandler = require('express-async-handler')
const CartModel = require('../../modules/cartModel')


//  @dec    clear logged Cart item
//  @route  Delete  /api/v1/cart/clearItem/:itemId
//  @access Private/user
exports.clearLoggedUserCartItem = asyncHandler(async (req, res, next) => {
    await CartModel.findOneAndDelete(
      { user: req.userModel._id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      {
        new: true,
      }
    );
  
    res.status(200).json({
    
      status: true,
      message: 'Successfully cleared item from cart',
    });
  });