const { check } = require("express-validator");

const i18n = require("i18n");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
      validatorMiddleware,
];

exports.createCatogryValidator = [
  check("title.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "categoryTitleEnglishRequired",
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
        phrase: "categoryTitleArabicRequired",
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

  validatorMiddleware,
];

exports.updateCatogryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
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

  validatorMiddleware,
];

exports.deleteCatogryValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  validatorMiddleware,
];
