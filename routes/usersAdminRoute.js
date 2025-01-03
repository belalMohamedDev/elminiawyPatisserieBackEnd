const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getActiveAdmin,
} = require("../services/adminServices/userAdmins/adminServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").get(getActiveAdmin);

module.exports = router;
