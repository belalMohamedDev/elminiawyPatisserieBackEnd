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

const router = express.Router();

router.use(authServices.protect);

//admin
router.use(authServices.allowedTo("admin"));
router
  .route("/:id/approveByAdmin")
  .put(passingOrderApprovedToReqBody, orderUpdate);
router.route("/:id/delivered").put(passingOrderDeliveredToReqBody, orderUpdate);
router.route("/:id/transit").put(passingOrderTransitToReqBody, orderUpdate);

router.route("/admin/pending").get(getAllPendingAdminOrder);
router.route("/admin").get(getAllAdminCompleteOrder);




//user
router.use(authServices.allowedTo("user"));
router.route("/:cartId").post(createCashOrder);
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
