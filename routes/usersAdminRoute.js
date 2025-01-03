const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getActiveAdmin,getInActiveAdmin
} = require("../services/adminServices/userAdmins/adminServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").get(getActiveAdmin);

router.route("/inActive").get(getInActiveAdmin);

module.exports = router;
