const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const categoryModel = require("../../modules/categoryModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidSubCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.createSubCatogryValidator = [
  check("title.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "subCatogryTitleEnglishRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "englishTitleLength",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 300 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "englishTitleLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("title.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "subCatogryTitleArabicRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "arabicTitleLength",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 300 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "arabicTitleLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("category")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "categoryTitleEnglishRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "categoryIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.updateSubCatogryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidSubCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  check("title.ar")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "arabicTitleLength",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 300 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "arabicTitleLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("title.en")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "englishTitleLength",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 300 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "englishTitleLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("category")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "categoryIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deletesubCatogryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidSubCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  validatorMiddleware,
];
