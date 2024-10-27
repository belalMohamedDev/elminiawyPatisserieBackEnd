const express = require('express')
const {
completeDriverSignUp

} = require('../services/delivery/auth/completeRegister')
const authServices = require('../services/authServices/protect')
const {addLoggedUserDataInBody} = require('../services/user/userServices/UserService')



const router = express.Router()




router.use(authServices.protect, authServices.allowedTo('delivery'))

router
  .route('/complete')
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    uploadImageInCloud,
    addLoggedUserDataInBody,
    completeDriverSignUp
  )



module.exports = router
