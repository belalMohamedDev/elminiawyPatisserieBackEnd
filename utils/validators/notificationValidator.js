const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../modules/categoryModel");
const productModel = require("../../modules/productModel");

exports.createNotificationValidator = [
  check("title").notEmpty().withMessage("title is required"),

  check("description").notEmpty().withMessage("title is required"),

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

  validatorMiddleware,
];
