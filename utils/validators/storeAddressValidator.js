const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createStoreAddressValidator = [
  check("BranchArea")
    .notEmpty()
    .withMessage("Branch Area is required")
    .isLength({ min: 3 })
    .withMessage("Too short Branch Area")
    .isLength({ max: 500 })
    .withMessage("Too long Branch Area"),

  check("region")
    .notEmpty()
    .withMessage("Region name is required")
    .isLength({ min: 3 })
    .withMessage("Too short region name"),

  check("briefness")
    .notEmpty()
    .withMessage("Briefness is required")
    .isLength({ min: 3 })
    .withMessage("Too short briefness")
    .isLength({ max: 500 })
    .withMessage("Too long briefness"),

    check("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude format"),
 
  check("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude format"),

  validatorMiddleware,
];

exports.updateBranchAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),

  check("BranchArea")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short Branch Area")
    .isLength({ max: 500 })
    .withMessage("Too long Branch Area"),

  check("region")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short region name"),

  check("briefness")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short briefness")
    .isLength({ max: 500 })
    .withMessage("Too long briefness"),

    check("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude format"),
 
  check("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude format"),

  validatorMiddleware,
];

exports.deleteBranchAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  validatorMiddleware,
];
