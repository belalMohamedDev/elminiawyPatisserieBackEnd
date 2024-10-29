const express = require("express");
const {
  completeDriverSignUp,
  resizeDriverIdsImages,
  uploadDriverIdsImages,
  uploadDriversImageIdInCloud,
} = require("../services/delivery/auth/completeRegister");

const {
  activeDriverAccount,
  getAllNotActiveUserDriver,
} = require("../services/delivery/auth/adminApprove");

const authServices = require("../services/authServices/protect");
const {
  addLoggedUserDataInBody,
} = require("../services/user/userServices/UserService");
const {
  driverCompleteSignUpValidator,
} = require("../utils/validators/driverCompleteDataValidator");

const router = express.Router();

router
  .route("/allDriverNotActive")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getAllNotActiveUserDriver
  );


  router
    .route("/:id/active")
    .put(
      authServices.protect,
      authServices.allowedTo("admin"),
      activeDriverAccount
    );

router.use(authServices.protect, authServices.allowedTo("delivery"));

router
  .route("/complete")
  .post(
    uploadDriverIdsImages,
    resizeDriverIdsImages,
    addLoggedUserDataInBody,
    driverCompleteSignUpValidator,
    uploadDriversImageIdInCloud,
    completeDriverSignUp
  );

module.exports = router;
