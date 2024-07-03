const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getCoupons,
  UpdateCoupon,
  deleteCoupon,
  createCoupon,
  getAllCoupons,
} = require("../services/couponServices/couponServices");

const {
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  getCouponValidator,
} = require("../utils/validators/couponValidator");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("admin"));
router.route("/").post(createCouponValidator, createCoupon).get(getAllCoupons);

router
  .route("/:id")
  .get(getCouponValidator, getCoupons)
  .put(updateCouponValidator, UpdateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);
module.exports = router;
