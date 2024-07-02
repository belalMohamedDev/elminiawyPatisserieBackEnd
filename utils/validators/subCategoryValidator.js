const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../../modules/categoryModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCatogry id format"),
  validatorMiddleware,
];

exports.createSubCatogryValidator = [
  check("title")
    .notEmpty()
    .withMessage("subCatogry title required")
    .isLength({ min: 3 })
    .withMessage("too short subCatogry title")
    .isLength({ max: 32 })
    .withMessage("too long subCatogry title"),

  check("category")
    .notEmpty()
    .withMessage("Catogry id required")
    .isMongoId()
    .withMessage("Invalid Catogry id format")
    .custom(
      asyncHandler(async (val) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this category id not found");
        }
      })
    ),

  validatorMiddleware,
];

exports.updateSubCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid subCatogry id format"),

  check("title")
  .optional()
  .isLength({ min: 3 })
  .withMessage("too short subCatogry title")
  .isLength({ max: 32 })
  .withMessage("too long subCatogry title"),

check("category")
  .optional()
  .isMongoId()
  .withMessage("Invalid Catogry id format")
  .custom(
    asyncHandler(async (val) => {
      const document = await categoryModel.findOne({ _id: val });
      if (!document) {
        throw new Error("this category id not found");
      }
    })
  ),

  validatorMiddleware,
];

exports.deletesubCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid subCatogry id format"),
  validatorMiddleware,
];
