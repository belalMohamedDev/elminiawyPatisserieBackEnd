const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../modules/categoryModel");
const subCategoryModel = require("../../modules/subCategoryModel");

exports.getProductValidator = [
    check("id").isMongoId().withMessage("Invalid product ID"),
    validatorMiddleware,
  ];

exports.createProductValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

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

  check("subCategory")
    .notEmpty()
    .withMessage("subCategory id required")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .custom(
      asyncHandler(async (val) => {
        const document = await subCategoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this subCategory id not found");
        }
      })
    ),

  check("options.*.optionName").optional(),
  check("options.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Additional price must be a positive number"),

  check("customizationOptions.*.name").optional(),
  check("customizationOptions.*.choices.*.name").optional(),

  check("customizationOptions.*.choices.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Additional price must be a positive number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  check("title").optional(),
  check("description").optional(),
  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

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

  check("subCategory")
    .notEmpty()
    .withMessage("subCategory id required")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .custom(
      asyncHandler(async (val) => {
        const document = await subCategoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this subCategory id not found");
        }
      })
    ),

  check("options.*.optionName").optional(),
  check("options.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Additional price must be a positive number"),
  check("customizationOptions.*.name").optional(),
  check("customizationOptions.*.choices.*.name").optional(),
  check("customizationOptions.*.choices.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Additional price must be a positive number"),
  validatorMiddleware,
];


exports.deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid product ID"),
    validatorMiddleware,
  ];