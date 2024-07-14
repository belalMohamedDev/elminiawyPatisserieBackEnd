const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../modules/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "userNameRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortUserName",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("email")
    .notEmpty()

    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "userEmailRequired",
        locale: req.headers["lang"] || "en",
      })
    )

    .isEmail()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidEmailAddressFormat",
        locale: req.headers["lang"] || "en",
      })
    )

    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error(
            i18n.__({
              phrase: "emailAlreadyUse",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  check("password")
    .notEmpty()

    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "passwordRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 6 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "PasswordLeastCharactersLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidPhoneNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "ThisroleNotFound",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("branchAddress")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidBranchAddressFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "userEmailRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isEmail()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidEmailAddressFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("password")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "passwordRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 6 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "PasswordLeastCharactersLong",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.tokenRefreshValidator = [
  check("refreshToken")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "refreshTokeRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.logOutValidator = [
  check("refreshToken")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "refreshTokeRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.restPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "userEmailRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isEmail()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidEmailAddressFormat",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("newPassword")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "passwordRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isLength({ min: 6 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "PasswordLeastCharactersLong",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.passwordConfirm) {
        throw new Error(
          i18n.__({
            phrase: "passwordConfirmationIncorrect",
            locale: req.headers["lang"] || "en",
          })
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "passwordConfirmationRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];
