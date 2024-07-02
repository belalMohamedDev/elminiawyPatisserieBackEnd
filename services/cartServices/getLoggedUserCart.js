const asyncHandler = require('express-async-handler')
const CartModel = require('../../modules/cartModel')
const ApiError = require('../../utils/apiError/apiError')

// @ dec get logged user cart
// @ route Get  /api/vi/cart
// @ access private/user

// // Helper function to check if two arrays of objects are equal
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  


const cart = await CartModel.findOne({ user: req.userModel._id });

  //check found data or no
  if (!cart) {
    //send faild response
    return next(
      new ApiError(`there is no cart for this user id : ${req.userModel._id}`, 404),
    )
  }

  
  res.status(200).json({
    status: true,
    message: "successfully get logged user data",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });});



