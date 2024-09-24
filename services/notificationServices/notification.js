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
    { $push: { notifications: { notificationId: notification._id } } }
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
  });
});

// @desc repeat notification
// @route POST /api/v1/notification/repeat
// @access Private

exports.repeatNotification = asyncHandler(async (req, res, next) => {
  const { title, description, product, category, notificationId } = req.body;

  const users = await userModel.find({ role: "user" });

  await userModel.updateMany(
    { role: "user" },
    { $push: { notifications: { notificationId: notificationId } } }
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
  });
});

// @desc get all notification to user
// @route POST /api/v1/notification/user
// @access Private
exports.getAllNotification = asyncHandler(async (req, res, next) => {
  const user = await req.userModel.populate({
    path: "notifications.notificationId",
    model: "notification",
  });

  res.status(200).json({
    status: true,
    message: "User notifications retrieved successfully",
    data: user.notifications,
  });
});

// @desc update all notifications with isSeen: false to seen
// @route POST /api/v1/notification/user/seen
// @access Private
exports.updateUnseenNotificationsToSeen = asyncHandler(
  async (req, res, next) => {
    const user = await req.userModel.populate({
      path: "notifications.notificationId",
      model: "notification",
    });

    const unseenNotifications = user.notifications.filter(
      (notification) => !notification.isSeen
    );

    unseenNotifications.forEach((notification) => {
      notification.isSeen = true;
    });

    await user.save();

    res.status(200).json({
      status: true,
      message: "All unseen notifications have been updated to seen.",
      data: user.notifications,
    });
  }
);

// @desc get all notification to admin
// @route POST /api/v1/notification/admin
// @access Private
exports.getAllNotificationToAdmin = factory.getAllData(
  notificationModel,
  "Notification"
);
