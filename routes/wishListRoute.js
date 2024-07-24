const express = require('express')
const {
  addOrRemoveProductInWishList,
  getAllProductFromWishList,
  removeProductFromWishList,
} = require("../services/wishListServices/wishList");
const authServices = require('../services/authServices/protect')




const router = express.Router({ mergeParams: true })


router.use(authServices.protect, authServices.allowedTo('user'))

router
  .route("/")
  .post(addOrRemoveProductInWishList)
  .get(getAllProductFromWishList)
  .delete(removeProductFromWishList);




module.exports = router
