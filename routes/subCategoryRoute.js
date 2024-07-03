const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  creatSubCategory,
  getAllSubCategory,
  getOneSubCategory,
  updateSubCategory,
  deleteSubCategory,
  uploadSubCategoryImage,
  resizeSubCategoryImage,
  uploadImageInCloud,
  createFilterObject,
  setCategoryIdInBody,
  deleteImageBeforeUpdate
} = require("../services/subCategoryServices/subCategoryService");

const {
  createSubCatogryValidator,
  getSubCategoryValidator,
  deletesubCatogryValidator,
  updateSubCatogryValidator,
} = require("../utils/validators/subCategoryValidator");



const router = express.Router({mergeParams:true});

router.route("/").get(createFilterObject,getAllSubCategory);

router.route("/:id").get(getSubCategoryValidator, getOneSubCategory);

router.use(authServices.protect, authServices.allowedTo("admin"));

router
  .route("/")
  .post(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    setCategoryIdInBody,
    uploadImageInCloud,
    createSubCatogryValidator,
    creatSubCategory
  )
  ;



router
  .route("/:id")
  .put(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    updateSubCatogryValidator,
    uploadImageInCloud,
    deleteImageBeforeUpdate,
    updateSubCategory
  )

  .delete(deletesubCatogryValidator, deleteSubCategory);

module.exports = router;
