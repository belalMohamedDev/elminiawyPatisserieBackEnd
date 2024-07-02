
const userModel = require('../../modules/userModel')

const factory = require('../handleFactor/handlerFactory')




// @ dec add new  product or store in wishList
// @ route Post  /api/vi/wishList
// @ access protected /user
exports.addProductOrStoreInWishList = factory.addOneToList(
    userModel,
  'wishList',
  'wishList',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete user wishList
// // @ route delete  /api/vi/wishList
// // @ access protected /user
exports.removeProductOrStoreFromWishList = factory.removeOneFromList(
    userModel,
  'whichList',
  'wishList',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all user wishList 
// @ route get  /api/vi/wishList
// @ access protected /user
exports.getAllProductOrStoreFromWishList = factory.getAllDataFromList(
    userModel,
  'wishList',
  'wishList',
)
