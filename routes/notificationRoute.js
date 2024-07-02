const express = require("express");
const {
  createFilterObject,
  createNotification,
  getAllNotification,
} = require("../services/notificationServices/notification");
const authServices = require("../services/authServices/protect");

const {
  createNotificationValidator,
} = require("../utils/validators/notificationValidator");

const router = express.Router();


router.use(authServices.protect);

router.route("/user").get(createFilterObject,getAllNotification);


router.use(authServices.allowedTo("admin"));

router.route("/").get(getAllNotification).post(createNotificationValidator,createNotification);

module.exports = router;
