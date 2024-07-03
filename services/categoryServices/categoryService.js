const { uploadToCloudinary } = require('../../middleware/cloudinaryMiddleWare')

const categoryModel = require('../../modules/categoryModel')

const { uploadSingleImage } = require('../../middleware/imageUploadMiddleware')
const {resizeImage} = require('../../middleware/resizeImage')
const factory = require('../handleFactor/handlerFactory')

//upload single image
const uploadCategoryImage = uploadSingleImage('image')

// resize image before upload
const resizeCategoryImage = resizeImage()

// upload image in cloud
const uploadImageInCloud = uploadToCloudinary('categories')

// @ dec create category
// @ route Post  /api/vi/category
// @ access private
const creatCategory = factory.creatOne(categoryModel, 'categories')

// @ dec get all  category data
// @ route Get  /api/vi/category
// @ access public
const getAllCategory = factory.getAllData(categoryModel, 'categories')

// @ dec get specific category
// @ route Get  /api/vi/category/id
// @ access public
const getOneCategory = factory.getOne(categoryModel, 'categories')

// @ dec update specific category
// @ route Update  /api/vi/category/id
// @ access Private
const updateCategory = factory.updateOne(categoryModel, 'categories')

// @ dec delete specific category
// @ route Update  /api/vi/category/id
// @ access Private
const deleteCategory = factory.deleteOne(categoryModel, 'categories')



// @ dec delete photo from cloud using when update
const deleteImageBeforeUpdate = factory.deletePhotoFromCloud(categoryModel)

module.exports = {
  creatCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
  uploadImageInCloud,deleteImageBeforeUpdate
}
