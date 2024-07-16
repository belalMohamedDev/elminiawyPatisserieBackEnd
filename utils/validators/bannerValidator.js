const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../../modules/categoryModel");
const productModel = require("../../modules/productModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createBannerValidator = [

  check("title")
    .notEmpty()
    .withMessage("Banner title is required")
    .isString()
    .withMessage("Banner title must be a string")
    .isLength({ min: 3 })
    .withMessage("Banner title is too short")
    .isLength({ max: 100 })
    .withMessage("Banner title is too long"),

  check("startDate")
    .notEmpty()
    .withMessage("Banner start date is required")
    .isISO8601()
    .withMessage("Banner start date must be a valid date"),

  check("endDate")
    .notEmpty()
    .withMessage("Banner end date is required")
    .isISO8601()
    .withMessage("Banner end date must be a valid date"),

  check("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Banner status must be either 'Active' or 'Inactive'"),


    check("category")
    .optional()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID")
    .custom(
      asyncHandler(async (val) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this category id not found");
        }
      })
    ),

  
  check("product")
    .optional()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid product ID")
    .custom(
      asyncHandler(async (val) => {
        const document = await productModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this product id not found");
        }
      })
    ),

  
  check("discount")
    .notEmpty()
    .withMessage("Banner discount required")
    .isFloat({ min: 0 })
    .withMessage("Banner discount must be a positive number"),

  validatorMiddleware,
];

exports.updateBannerValidator = [
  check("id").isMongoId().withMessage("Invalid banner id format"),

  check("image")
    .optional()
    .isString()
    .withMessage("Banner image must be a string"),

  check("publicId")
    .optional()
    .isString()
    .withMessage("Banner publicId must be a string"),

  check("title")
    .optional()
    .isString()
    .withMessage("Banner title must be a string")
    .isLength({ min: 3 })
    .withMessage("Banner title is too short")
    .isLength({ max: 100 })
    .withMessage("Banner title is too long"),

  check("startDate")
    .optional()
    .isISO8601()
    .withMessage("Banner start date must be a valid date"),

  check("endDate")
    .optional()
    .isISO8601()
    .withMessage("Banner end date must be a valid date"),

  check("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Banner status must be either 'Active' or 'Inactive'"),

  check("category")
    .optional()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID")
    .custom(
      asyncHandler(async (val) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this category id not found");
        }
      })
    ),

  
  check("product")
    .optional()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid product ID")
    .custom(
      asyncHandler(async (val) => {
        const document = await productModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this product id not found");
        }
      })
    ),

  
  check("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Banner discount must be a positive number"),

  validatorMiddleware,
];

exports.deleteBannerValidator = [
  check("id").isMongoId().withMessage("Invalid banner id format"),
  validatorMiddleware,
];
