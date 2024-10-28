const express = require("express");
const {
  completeDriverSignUp,
  resizeDriverIdsImages,
  uploadDriverIdsImages,
  uploadDriversImageIdInCloud,
} = require("../services/delivery/auth/completeRegister");
const authServices = require("../services/authServices/protect");
const {
  addLoggedUserDataInBody,
} = require("../services/user/userServices/UserService");
const {
  driverCompleteSignUpValidator,
} = require("../utils/validators/driverCompleteDataValidator");

const router = express.Router();

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
