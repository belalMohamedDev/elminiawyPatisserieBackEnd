const asyncHandler = require('express-async-handler')
const ProductModel = require('../../modules/productModel')
const CartModel = require('../../modules/cartModel')
const ApiError = require('../../utils/apiError/apiError')


// @ dec Add product to  cart
// @ route Post  /api/vi/cart
// @ access private/user

// // Helper function to check if two arrays of objects are equal
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const {
    product,
    quantity,
    options,
    customizations,
    notes,

    
    
  } = req.body;


  const productObject = await ProductModel.findById(product);

    //check found data or no
    if (!productObject) {
      //send faild response
      return next(
        new ApiError(`Faild To get product data from this id ${product}`, 404),
      )
    }


  //get cart for logged user
  let cart = await CartModel.findOne({ user: req.userModel._id });
  if (!cart) {
    cart = new CartModel({
      user: req.userModel._id,    
      notes: notes,
      cartItems: [{
        product: productObject._id,
        quantity: quantity,
        options: options,
        customizations: customizations,
        price: productObject.price,
      }],
    });
  } else {

  const existingItemIndex = cart.cartItems.findIndex((item) =>
    item.product._id.toString() === productObject._id.toString() &&
    isEqualArray(item.options, options) &&
    isEqualArray(item.customizations, customizations) &&
    item.price === productObject.price);
   



    if (existingItemIndex > -1) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        product: productObject._id,
        quantity: quantity,
        options: options,
        customizations: customizations,
        price: productObject.price,
     
      });
    }
  }

  await cart.save();
  res.status(200).json({
    status: true,
    message: "protuct added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });});



function isEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i += 1) {
    if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
  }
  return true;
}