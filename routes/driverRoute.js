const express = require("express");
const {
  completeDriverSignUp,
  resizeDriverIdsImages,
  uploadDriverIdsImages,
  uploadDriversImageIdInCloud,
} = require("../services/driverServices/auth/completeRegister");

const {
getAllDriverOrders
} = require("../services/driverServices/orders/getAllOrders");

const {
acceptedOrderByDrivers
} = require("../services/driverServices/orders/acceptOrder");


const {
  canceledOrderByDrivers
} = require("../services/driverServices/orders/cancelOrder");

const {

  createFilterObject,
  getAllDeliveredOrder,createFilterObjectAcceptedOrder,createFilterObjectCancelledOrder
} = require("../services/driverServices/orders/deliveredOrder");

const {
  activeDriverAccount,
  getAllNotActiveUserDriver,
} = require("../services/adminServices/approveDriver/adminApprove");

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

router.route("/getNewOrders").post(getAllDriverOrders);

router.route("/deliveredOrder").get(createFilterObject, getAllDeliveredOrder);

router
  .route("/cancelledOrder")
  .get(createFilterObjectCancelledOrder, getAllDeliveredOrder);

router
  .route("/acceptedDeliveredOrder")
  .get(createFilterObjectAcceptedOrder, getAllDeliveredOrder);


router.route("/:orderId/accept").put(acceptedOrderByDrivers);

router.route("/:orderId/canceledOrder").delete(canceledOrderByDrivers);


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
