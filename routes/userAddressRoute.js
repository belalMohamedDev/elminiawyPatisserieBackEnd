const express = require("express");
const authServices = require("../services/authServices/protect");


const {
  creatAddress,
  passingDataToReqBody,
  updateAddress,
  deleteAddress,
  createFilterObject,
  getAllAddress,
} = require("../services/user/userAddress/addressService");

const {
 checkLocationAvailable
} = require("../services/user/userAddress/checkLocationAvaliable");

const {
  createAddressValidator,
  deleteAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router
  .route("/isAvailable")
  .post(checkLocationAvailable);

router.use(authServices.protect);

router
  .route("/")
  .get(createFilterObject, getAllAddress)
  .post(passingDataToReqBody, createAddressValidator, creatAddress);

router
  .route("/:id")
  .delete(deleteAddressValidator, deleteAddress)
  .put(
    passingDataToReqBody,
    updateAddressValidator,
    updateAddress
  );

module.exports = router;
