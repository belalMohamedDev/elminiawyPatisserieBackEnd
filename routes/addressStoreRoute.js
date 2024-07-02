const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  UpdatestoreAddress,
  createstoreAddress,
  deletestoreAddress,
  getAllstoreAddresss,
  passingDataToReqBody,
} = require("../services/storeScervice/addressStore/storeAddress");

const {
  createStoreAddressValidator,
  updateBranchAddressValidator,
  deleteBranchAddressValidator
} = require("../utils/validators/storeAddressValidator");

const router = express.Router();

router.use(authServices.protect);

router.route("/").get(getAllstoreAddresss);

router.use(authServices.allowedTo("admin"));

router
  .route("/")
  .post(createStoreAddressValidator, passingDataToReqBody, createstoreAddress);
router
  .route("/:id")
  .put(updateBranchAddressValidator, passingDataToReqBody, UpdatestoreAddress);

router
  .route("/:id")
  .delete(deleteBranchAddressValidator, deletestoreAddress);

module.exports = router;
