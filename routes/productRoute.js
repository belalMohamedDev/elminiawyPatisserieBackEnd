const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  createNewProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSpecificProduct,
  resizeProductImage,
  uploadImageInCloud,
  uploadProductImage,
  passingDataToReqBody,
} = require("../services/storeScervice/productsServices/product/productServices");

const {
  getAllProductsBelongsTosubCategory,
} = require("../services/storeScervice/productsServices/product/getProductWithSubcategory");

const {
  addProductOption,
  getAllProductOption,
  removeProductOption,
  updateProductOptions,
} = require("../services/storeScervice/productsServices/option/optionProductServices");

const {
  addProductCustomizationOptions,
  getAllProductCustomizationOptions,
  removeProductCustomizationOptions,
  updateProductCustomizationOptions,
} = require("../services/storeScervice/productsServices/customizationOptions/productCustomizationOptionsServices");

const {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");

const reviewRoute = require("./reviewRoute");

const router = express.Router();

//post  /product/productId/reviews
//Get  /product/productId/reviews
//Get  /product/productId/reviews/reviewId
router.use("/:productId/reviews", reviewRoute);

router.route("/").get(getAllProduct);
router.route("/:categoryId/category").get(getAllProductsBelongsTosubCategory);
router.route("/:id").get(getProductValidator,getSpecificProduct);

router.use(authServices.protect);

router.use(authServices.allowedTo("admin"));

router.route("/:id/option").post(addProductOption);

router.route("/:id/option").delete(removeProductOption);

router.route("/:id/option").get(getAllProductOption);

router.route("/:productId/option/:optionsId").put(updateProductOptions);

router.route("/:id/customizationOptions").post(addProductCustomizationOptions);

router
  .route("/:id/customizationOptions")
  .delete(removeProductCustomizationOptions);

router
  .route("/:id/customizationOptions")
  .get(getAllProductCustomizationOptions);

router
  .route("/:productId/customization-options/:optionId/choices/:choiceId")
  .put(updateProductCustomizationOptions);

router
  .route("/")
  .post(
    uploadProductImage,
    resizeProductImage,
    passingDataToReqBody,
    createProductValidator,
    uploadImageInCloud,
    createNewProduct
  );
router
  .route("/:id")
  .put(
    uploadProductImage,
    resizeProductImage,
    uploadImageInCloud,
    passingDataToReqBody,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator,deleteProduct);

module.exports = router;
