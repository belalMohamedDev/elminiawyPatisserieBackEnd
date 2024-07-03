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
    createSubCatogryValidator,
    creatSubCategory
  )
  ;



router
  .route("/:id")
  .put(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    deleteImageBeforeUpdate,
    updateSubCatogryValidator,
    updateSubCategory
  )

  .delete(deletesubCatogryValidator, deleteSubCategory);

module.exports = router;
