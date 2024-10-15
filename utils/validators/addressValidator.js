const { check } = require("express-validator");
const i18n = require("i18n");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const storeAddressModel = require("../../modules/storeAddressModel");
const asyncHandler = require("express-async-handler");

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
    .isLength({ max: 1000 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongBuildingName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "englishRegionNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortEnglishRegionName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 1000 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongEnglishRegionName",
        locale: req.headers["lang"] || "en",
      })
    ),

    check("region.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "arabicRegionNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortArabicRegionName",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ max: 1000 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooLongArabicRegionName",
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

  check("nearbyStoreAddress")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidStoreAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const store = await storeAddressModel.find({ _id: val });

        if (!store) {
          throw new Error(
            i18n.__({
              phrase: "storeNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
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
    .isLength({ max: 1000 })
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
    .isLength({ max: 1000 })
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

  check("nearbyStoreAddress")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidStoreAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const store = await storeAddressModel.find({ _id: val });

        if (!store) {
          throw new Error(
            i18n.__({
              phrase: "storeNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteAddressValidator = [
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
