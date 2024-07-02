const express = require("express");
const { login } = require("../services/authServices/loginServices");

const { signUp } = require("../services/authServices/signUpServices");
const { logOut } = require("../services/authServices/logOut");
const { newAccessToken } = require("../services/authServices/newAccessToken");
const {
  forgetPassword,
  resetPassword,
  verifyCode,
} = require("../services/authServices/forgetPasswordServiece");

const {
  loginValidator,
  signUpValidator,
  restPasswordValidator,
  logOutValidator,
  tokenRefreshValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signUp").post(signUpValidator, signUp);

router.route("/login").post(loginValidator, login);

router.route("/logout").post(logOutValidator, logOut);
router.route("/token").post(tokenRefreshValidator, newAccessToken);

router.route("/forgetPassword").post(forgetPassword);

router.route("/verifyCode").post(verifyCode);

router.route("/resetPassword").put(restPasswordValidator, resetPassword);

module.exports = router;
