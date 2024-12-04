const { check } = require("express-validator");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createBannerValidator = [
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

  validatorMiddleware,
];

exports.updateBannerValidator = [
  check("id").isMongoId().withMessage("Invalid banner id format"),

  check("startDate")
    .optional()
    .isISO8601()
    .withMessage("Banner start date must be a valid date"),

  check("endDate")
    .optional()
    .isISO8601()
    .withMessage("Banner end date must be a valid date"),

  validatorMiddleware,
];

exports.deleteBannerValidator = [
  check("id").isMongoId().withMessage("Invalid banner id format"),
  validatorMiddleware,
];
