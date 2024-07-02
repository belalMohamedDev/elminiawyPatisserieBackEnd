const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");



exports.createAddressValidator = [
  check("BuildingName")
    .notEmpty()
    .withMessage("Building Name is required")
    .isLength({ min: 3 })
    .withMessage("too short Building Name")
    .isLength({ max: 50 })
    .withMessage("too long Building Name"),

    check("region")
    .notEmpty()
    .withMessage("region name is required")
    .isLength({ min: 3 })
    .withMessage("too short region name")
    .isLength({ max: 50 })
    .withMessage("too long region Name"),


    check("phone")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egypt phone numbers"),


    check("alias")
    .isIn(["Apartment", "House", "Office"])
    .withMessage("alias data not match data"),


  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  
  
    check("BuildingName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short Building Name")
    .isLength({ max: 50 })
    .withMessage("too long Building Name"),

    check("region")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short region name")
    .isLength({ max: 50 })
    .withMessage("too long region Name"),


    check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egypt phone numbers"),


  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  validatorMiddleware,
];
