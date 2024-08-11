const express = require("express");
const authServices = require("../services/authServices/protect");
const { addProductToCart } = require("../services/cartServices/cartServices");

const {
  getLoggedUserCart,
} = require("../services/cartServices/getLoggedUserCart");
const {
  removeSpecificCartItem,
} = require("../services/cartServices/removeCartItem");
const {
  clearLoggedUserCartItem,
} = require("../services/cartServices/clearLoggedUserCartItem");
const {
  updateSpecificCartItemQuantity,
} = require("../services/cartServices/updateSpecificCartItemQuantity");
const {
  applyCouponOnLoggedUserCart,
} = require("../services/cartServices/applyCouponOnLoggedUserCart");

const { cardSetting } = require("../services/cartServices/cartSetting");

const router = express.Router();
router
  .route("/updateTaxAndShipping")
  .put(authServices.protect, authServices.allowedTo("admin"), cardSetting);

router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(addProductToCart).get(getLoggedUserCart);
router.route("/applyCoupon").put(applyCouponOnLoggedUserCart);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateSpecificCartItemQuantity);

router.route("/clearItem/:itemId").delete(clearLoggedUserCartItem);

module.exports = router;
