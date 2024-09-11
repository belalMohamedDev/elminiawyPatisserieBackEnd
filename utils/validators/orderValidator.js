const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userAddressModel = require("../../modules/userAddressModel");
const i18n = require("i18n");




exports.createCashOrderValidator = [
    check("cartId")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "cartIdRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCartIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("notes").optional(),

  check("shippingAddress")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "shippingAddressRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidshippingAddressIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await userAddressModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "shippingAddressIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),
    validatorMiddleware,
  ];