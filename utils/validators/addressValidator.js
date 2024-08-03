const { check } = require("express-validator");
const i18n = require("i18n");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createAddressValidator = [
  check("buildingName")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "buildingNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortBuildingName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 50 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongBuildingName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region")
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
        phrase: "tooShortRegionName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 50 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongRegionName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("phone")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "phoneNumberRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isMobilePhone(["ar-EG"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidPhoneNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("alias")
    .isIn(["Apartment", "House", "Office"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "aliasMatchData",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  
  check("buildingName")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortBuildingName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 50 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongBuildingName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region")
    .notEmpty()
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortRegionName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 50 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongRegionName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidPhoneNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("id").isMongoId().withMessage((value, { req }) =>
    i18n.__({
      phrase: "invalidAddressIdFormat",
      locale: req.headers["lang"] || "en",
    })
  ),
  validatorMiddleware,
];
