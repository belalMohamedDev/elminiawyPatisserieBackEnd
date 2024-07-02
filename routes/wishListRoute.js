const express = require('express')
const {
  addProductOrStoreInWishList,
  getAllProductOrStoreFromWishList,
  removeProductOrStoreFromWishList,
} = require('../services/wishListServices/wishList')
const authServices = require('../services/authServices/protect')
const {
  getLoggedUserData,
} = require('../services/user/userServices/UserService')

const {
  creatWishListValidator,
  deleteItemFromWishListValidator,
} = require('../utils/validators/wishListValidator')

const router = express.Router({ mergeParams: true })


router.use(authServices.protect, authServices.allowedTo('user'))

router
  .route('/')
  .post(getLoggedUserData, creatWishListValidator, addProductOrStoreInWishList)
  .get(getLoggedUserData, getAllProductOrStoreFromWishList)
  .delete(
    authServices.allowedTo('admin', 'user'),
    getLoggedUserData,
    deleteItemFromWishListValidator,
    removeProductOrStoreFromWishList,
  )




module.exports = router
