const express = require('express')
const {
  creatCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
  uploadImageInCloud,
  deleteImageBeforeUpdate,

} = require('../services/categoryServices/categoryService')
const authServices = require('../services/authServices/protect')

const {
  createCatogryValidator,
  getCategoryValidator,
  updateCatogryValidator,
  deleteCatogryValidator,
} = require('../utils/validators/categoryValidator')


const router = express.Router()


router.route('/').get(getAllCategory)

router.route('/:id').get(getCategoryValidator, getOneCategory)

router.use(authServices.protect, authServices.allowedTo('admin'))

router
  .route('/')
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCatogryValidator,
    uploadImageInCloud,
    creatCategory,
  )

router
  .route('/:id')
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCatogryValidator,
    uploadImageInCloud,
    deleteImageBeforeUpdate,
    updateCategory,
  )

  .delete(deleteCatogryValidator, deleteCategory)

module.exports = router
