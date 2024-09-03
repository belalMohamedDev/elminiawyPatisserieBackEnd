const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const userModel = require("../../modules/userModel");
const productModel = require("../../modules/productModel");

// @dec Add new product in wishList
// @route POST /api/v1/wishList
// @access Protected /user
exports.addOrRemoveProductInWishList = asyncHandler(async (req, res, next) => {
  // Extract user ID and product ID from the request
  const productId = req.body.product;
  const user = req.userModel;

  // Check if the product is already in the user's wishlist
  const productIndex = user.wishList.findIndex(
    (wishListItem) => wishListItem.toString() === productId
  );

  let message;

  if (productIndex === -1) {
    // Product is not in the wishlist, so add it

    user.wishList.push(productId);
    message = i18n.__("productAddedSuccessfullyWishlist");
  } else {
    // Product is in the wishlist, so remove it

    user.wishList.splice(productIndex, 1);
    message = i18n.__("productRemovedSuccessfullyWishlist");
  }

  // Save the updated user
  await user.save();

  const userPopulate = await req.userModel.populate("wishList");

  // // Localize the products
  const localizedDocument = productModel.schema.methods.toJSONLocalizedOnly(
    userPopulate.wishList,
    req.headers["lang"] || "en"
  );

  const wishlistProducts = localizedDocument.map((product) => {
    return {
      ...product,
      in_wishlist: true,
    };
  });


  // Send success response
  res.status(200).json({
    status: true,
    message,
    data: wishlistProducts,
  });
});

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete user wishList
// // @ route delete  /api/vi/wishList
// // @ access protected /user
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const userUpdate = await userModel.findByIdAndUpdate(
    req.userModel.id,
    {
      $pull: { wishList: req.body.product },
    },
    {
      new: true,
    }
  );

  if (!userUpdate) {
    return res.status(400).json({
      status: false,
      message: i18n.__("failedToRemoveProductFromWishlist"),
    });
  }

  res.status(201).json({
    status: true,
    message: i18n.__("productRemovedSuccessfullyWishlist"),
  });
});

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all user wishList
// @ route get  /api/vi/wishList
// @ access protected /user

exports.getAllProductFromWishList = asyncHandler(async (req, res) => {
  const user = await req.userModel.populate("wishList");

  if (!user || !user.wishList) {
    return res.status(200).json({
      status: true,
      message: i18n.__("noProductsInWishlist"),
    });
  }

  // Localize the products
  const localizedDocument = productModel.schema.methods.toJSONLocalizedOnly(
    user.wishList,
    req.headers["lang"] || "en"
  );

  const wishlistProducts = localizedDocument.map((product) => {
    return {
      ...product,
      in_wishlist: true,
    };
  });

  // send success response with data
  res.status(200).json({
    status: true,
    message: i18n.__("successGetAllWishlistProducts"),
    data: wishlistProducts,
  });
});
