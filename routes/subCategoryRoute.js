const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  creatSubCategory,
  getAllSubCategory,
  getOneSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObject,getAllSubCategoryFromCategory
} = require("../services/subCategoryServices/subCategoryService");

const {
  createSubCatogryValidator,
  getSubCategoryValidator,
  deletesubCatogryValidator,
  updateSubCatogryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

router.route("/").get(getAllSubCategory);

router
  .route("/:categoryId/category")
  .get(createFilterObject, getAllSubCategoryFromCategory);

router.route("/:id").get(getSubCategoryValidator, getOneSubCategory);

router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").post(createSubCatogryValidator, creatSubCategory);

router
  .route("/:id")
  .put(updateSubCatogryValidator, updateSubCategory)

  .delete(deletesubCatogryValidator, deleteSubCategory);

module.exports = router;
