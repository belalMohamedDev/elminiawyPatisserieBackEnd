const express = require("express");
const {
  getAllNotificationToAdmin,
  repeatNotification,
  createNotification,
  getAllNotification,
} = require("../services/notificationServices/notification");
const authServices = require("../services/authServices/protect");

const {
  createNotificationValidator,
} = require("../utils/validators/notificationValidator");

const router = express.Router();

router.use(authServices.protect);

router.route("/user").get(getAllNotification);

router.use(authServices.allowedTo("admin"));

router
  .route("/")
  .get(getAllNotificationToAdmin)
  .post(createNotificationValidator, createNotification);

  
router
.route("/repeat")
.post(repeatNotification);

module.exports = router;
