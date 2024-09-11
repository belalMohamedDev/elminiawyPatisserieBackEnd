const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  checkOutSession,
  createCashOrder,
} = require("../services/orderServices/userOrder/orderServices");

const {
  createFilterObjectToGetAllCompleteUserOrder,
  createFilterObjectToGetAllPendingUserOrder,
  getAllUserOrder,
  orderCancelled,
  passingOrderCancelledToReqBody,
} = require("../services/orderServices/userOrder/userOrder");

const {
  orderUpdate,
  passingOrderApprovedToReqBody,
  passingOrderDeliveredToReqBody,
  passingOrderTransitToReqBody,
} = require("../services/orderServices/adminOrder/adminOrderStatus");

const {
  getAllAdminCompleteOrder,
  getAllPendingAdminOrder,
} = require("../services/orderServices/adminOrder/getAdminOrder");


const {
createCashOrderValidator
} = require("../utils/validators/orderValidator");

const router = express.Router();

router.use(authServices.protect);

//admin

router
  .route("/:id/approveByAdmin")
  .put(
    authServices.allowedTo("admin"),
    passingOrderApprovedToReqBody,
    orderUpdate
  );
router
  .route("/:id/delivered")
  .put(
    authServices.allowedTo("admin"),
    passingOrderDeliveredToReqBody,
    orderUpdate
  );
router.route("/:id/transit").put(passingOrderTransitToReqBody, orderUpdate);

router
  .route("/admin/pending")
  .get(authServices.allowedTo("admin"), getAllPendingAdminOrder);
router
  .route("/admin")
  .get(authServices.allowedTo("admin"), getAllAdminCompleteOrder);


//user
router.use(authServices.allowedTo("user"));
router.route("/").post(createCashOrderValidator,createCashOrder);
router.route("/checkOut-session/:cartId").get(checkOutSession);
router
  .route("/user")
  .get(createFilterObjectToGetAllCompleteUserOrder, getAllUserOrder);
router
  .route("/user/pending")
  .get(createFilterObjectToGetAllPendingUserOrder, getAllUserOrder);

router
  .route("/:id/cancelled")
  .put(passingOrderCancelledToReqBody, orderCancelled);

module.exports = router;
