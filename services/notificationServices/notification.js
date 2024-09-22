const asyncHandler = require("express-async-handler");

const factory = require("../handleFactor/handlerFactory");
const notificationModel = require("../../modules/notificationModal");
const userModel = require("../../modules/userModel");
const PushNotification = require("../../config/firebase/firebase");

// @desc create notification
// @route POST /api/v1/notification
// @access Private


exports.createNotification = asyncHandler(async (req, res, next) => {
  const { title, description, product, category } = req.body;

  const notification = await notificationModel.create({
    title,
    description,
    product,
    category,
  });

  const users = await userModel.find({ role: "user" });

  await userModel.updateMany(
    { role: "user" },
    { $push: { notifications: notification._id } }
  );

  const pushNotifications = users.map((user) => {
    return PushNotification({
      title,
      description,
      product,
      category,
      userId: user._id,
    });
  });

  await Promise.all(pushNotifications);

  res.status(200).json({
    status: true,
    message: "Notification sent successfully to all users",
    data: notification,
  });
});

// @desc get all notification to user
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  filterObject = { createdAt: { $gt: req.userModel.createdAt } };
  req.filterObject = filterObject;
  next();
};

// @desc get all notification
// @route POST /api/v1/notification
// @access Private
exports.getAllNotification = factory.getAllData(
  notificationModel,
  "notification"
);
