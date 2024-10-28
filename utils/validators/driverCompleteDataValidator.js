const { check } = require("express-validator");
const i18n = require("i18n")
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.driverCompleteSignUpValidator = [
  check("deliveryType")
    .optional()
    .isIn(["freelancer", "salaryBased"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidDeliveryType",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("typeOfTheVehicle")
    .optional()
    .isIn(["car", "withOutAVehicle", "bicycle", "motorcycle"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidVehicleType",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("NationalId")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "nationalIdRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 14, max: 14 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "nationalIdLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("region")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3, max: 300 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "regionLength",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];
