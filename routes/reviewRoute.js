const express = require("express");
const {
  creatReview,
  deleteReview,
  getAllReviews,
  getOneReview,
  updateReview,
  createFilterObject,
  setProductIdIdInBody
} = require("../services/reviewServices/reviewService");
const authServices = require("../services/authServices/protect");
const {
  addLoggedUserDataInBody,
} = require("../services/user/userServices/UserService");

const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router.route("/").get(createFilterObject, getAllReviews);

router.route("/:id").get(getReviewValidator, getOneReview);

router.use(authServices.protect);

router
  .route("/")
  .post(
    authServices.allowedTo("user"),
    addLoggedUserDataInBody,
    setProductIdIdInBody,
    createReviewValidator,
    creatReview
  );

router
  .route("/:id")
  .put(
    authServices.allowedTo("user"),
    addLoggedUserDataInBody,
    updateReviewValidator,
    updateReview
  )

  .delete(
    authServices.allowedTo("admin", "user"),
    addLoggedUserDataInBody,
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
