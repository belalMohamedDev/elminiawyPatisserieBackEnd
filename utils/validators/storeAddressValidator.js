const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const i18n = require("i18n");

exports.createStoreAddressValidator = [
  check("BranchArea.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("BranchArea.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameTooShort",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameTooShort",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("briefness.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("briefness.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("latitude")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "latitudeRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isFloat({ min: -90, max: 90 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidLatitudeFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("longitude")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "longitudeRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isFloat({ min: -180, max: 180 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidLongitudeFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.updateBranchAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("BranchArea.ar")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("BranchArea.en")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "branchAreaTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region.ar")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameTooShort",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region.en")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionNameTooShort",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("briefness.en")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("briefness.ar")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooShort",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 500 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "briefnessTooLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidLatitudeFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidLongitudeFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.deleteBranchAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  validatorMiddleware,
];
