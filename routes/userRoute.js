const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  creatUser,
  getAllUser,
  getOneUser,
  getLoggedUserData,

  deleteUser,
  uploadImageInCloud,
  uploadUserImage,
  resizeUserImage,
} = require("../services/user/userServices/UserService");

const {
  updateLoggedUserPassword,
} = require("../services/user/userServices/updateLoggedPassword");

const {
  updateLoggedUserData,
} = require("../services/user/userServices/updateLoggedUserData");

const {
  updateUserPassword,
} = require("../services/user/userServices/updatePassword");

const {
  updateUser,
  deleteImageBeforeUpdate,
} = require("../services/user/userServices/updateUser");

const {
  updateLoggedUserImage,
} = require("../services/user/userServices/updateloggetUserImage");
const {
  deleteLoggedUser,
} = require("../services/user/userServices/deleteLoggedUser");

const {
  updateLoggedUserEmail
} = require("../services/user/userServices/updateLoggedUserEmail");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserEmailAddressValidator
} = require("../utils/validators/userValidator");

const router = express.Router();

//////////////////////////////////////////////
////////////////////
//////////////////////////////////////////////

router.use(authServices.protect);

router.route("/getMe").get(getLoggedUserData, getOneUser);



router
  .route("/updateMyData")
  .put(updateLoggedUserValidator, updateLoggedUserData);


  router
  .route("/updateMyEmailAddress")
  .put(changeLoggedUserEmailAddressValidator, updateLoggedUserEmail);

router
  .route("/updateMyImage")
  .put(
    uploadUserImage,
    resizeUserImage,
    uploadImageInCloud,
    getLoggedUserData,
    deleteImageBeforeUpdate,
    updateLoggedUserImage
  );


router
  .route("/updateMyPassword")
  .put(changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.route("/deleteMe").delete(deleteLoggedUser);

////////////////////////////////////////////////////
/////////////////////////////////
///////////////////////////////////////////////////

router.use(authServices.allowedTo("admin"));

router
  .route("/")
  .post(
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    uploadImageInCloud,
    creatUser
  );

router.route("/").get(getAllUser);

router
  .route("/:id")
  .get(getUserValidator, getOneUser)
  .put(
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    uploadImageInCloud,
    deleteImageBeforeUpdate,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, updateUserPassword);

module.exports = router;
