const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  UpdatestoreAddress,
  createstoreAddress,
  deletestoreAddress,
  getAllstoreAddresss,
  passingDataToReqBody,
  getRegions,
} = require("../services/adminServices/addressStore/storeAddress");

const {
  createStoreAddressValidator,
  updateBranchAddressValidator,
  deleteBranchAddressValidator,
} = require("../utils/validators/storeAddressValidator");

const router = express.Router();

router.route("/").get(getAllstoreAddresss);
router.route("/regions").get(getRegions);


router.use(authServices.protect,authServices.allowedTo("admin"));

router
  .route("/")
  .post(createStoreAddressValidator, passingDataToReqBody, createstoreAddress);
router
  .route("/:id")
  .put(updateBranchAddressValidator, passingDataToReqBody, UpdatestoreAddress);

router.route("/:id").delete(deleteBranchAddressValidator, deletestoreAddress);

module.exports = router;
