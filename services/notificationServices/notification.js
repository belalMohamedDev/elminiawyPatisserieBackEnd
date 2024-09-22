const asyncHandler = require("express-async-handler");

const factory = require("../handleFactor/handlerFactory");
const notificationModel = require("../../modules/notificationModal");
const PushNotification = require("../../config/firebase/firebase");

// @desc create notification
// @route POST /api/v1/notification
// @access Private
exports.createNotification = asyncHandler(async (req, res, next) => {
  const { title, description, product, category } = req.body;

  const document = await notificationModel.create({
    title,
    description,
    product,
    category,
  });

  PushNotification({
    title,
    description,
    product,
    category,
  });

  res.status(200).json({
    status: true,
    message: "Notification sent successfully",
    data: document,
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
exports.getAllNotification = factory.getAllData(notificationModel, "notification");
