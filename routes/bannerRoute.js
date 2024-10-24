const express = require("express");
const {
  UpdateBanner,
  createBanner,
  deleteBanner,
  deleteImageBeforeUpdate,
  getAllbanner,
  uploadImageInCloud,
  resizeBannerImage,
  uploadBannerImage,
} = require("../services/bannerServices/bannerServices");
const authServices = require("../services/authServices/protect");

const {
  createBannerValidator,
  deleteBannerValidator,
  updateBannerValidator,
} = require("../utils/validators/bannerValidator");

const router = express.Router();

router.route("/").get(getAllbanner);

router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").post(
  uploadBannerImage,
  resizeBannerImage,
  createBannerValidator,
  uploadImageInCloud,
  createBanner
);

router
  .route("/:id")
  .put(
    uploadBannerImage,
    resizeBannerImage,
    updateBannerValidator,
    uploadImageInCloud,

    deleteImageBeforeUpdate,
    UpdateBanner
  )

  .delete(deleteBannerValidator, deleteBanner);

module.exports = router;
