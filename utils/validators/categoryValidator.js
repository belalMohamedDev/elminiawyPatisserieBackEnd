const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  validatorMiddleware,
];

exports.createCatogryValidator = [
  check("title")
    .notEmpty()
    .withMessage("Catogry title required")
    .isLength({ min: 3 })
    .withMessage("too short Catogry title")
    .isLength({ max: 300 })
    .withMessage("too long Catogry title"),

  validatorMiddleware,
];

exports.updateCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short Catogry title")
    .isLength({ max: 300})
    .withMessage("too long Catogry title"),

  validatorMiddleware,
];

exports.deleteCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  validatorMiddleware,
];
