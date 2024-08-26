const { check, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../modules/userModel");
const i18n = require("i18n");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("too short User name"),

  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error("E-mail already in user");
        }
      })
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password or password confirmation incorrect");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA phone numbers"),

  check("image").optional(),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("This role is not found"),

  check("branchAddress")
    .optional()
    .isMongoId()
    .withMessage("Invalid branch Address format"),
  check("active").optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error("E-mail already in user");
        }
      })
    ),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("This role is not found"),

  check("branchAddress")
    .optional()
    .isMongoId()
    .withMessage("Invalid branch Address format"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA phone numbers"),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short User name"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("currentPassword").notEmpty().withMessage("current Password required"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom(async (val, { req }) => {
      //1) verify current password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user with id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.changeLoggedUserPasswordValidator = [
  check("currentPassword").notEmpty().withMessage((value, { req }) =>
    i18n.__({
      phrase: "currentPasswordRequired",
      locale: req.headers["lang"] || "en",
    })
  ),


  check("passwordConfirm")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "passwordConfirmationRequired",
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
    .withMessage("password must be at least 6 characters long")
    .custom(async (val, { req }) => {
      //1) verify current password
      const user = await UserModel.findById(req.userModel._id);
      if (!user) {
        throw new Error(  i18n.__({
            phrase: "thereIsNoUserWithId",
            locale: req.headers["lang"] || "en",
          }));
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error( i18n.__({
          phrase: "incorrectCurrentPassword",
          locale: req.headers["lang"] || "en",
        }));
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error(i18n.__({
          phrase: "passwordConfirmationIncorrect",
          locale: req.headers["lang"] || "en",
        }));
      }
      return true;
    }),
  validatorMiddleware,
];




exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "tooShortUserName",
        locale: req.headers["lang"] || "en",
      })
    ),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "invalidPhoneNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.changeLoggedUserEmailAddressValidator = [
  check("currentPassword").notEmpty().withMessage((value, { req }) =>
    i18n.__({
      phrase: "currentPasswordRequired",
      locale: req.headers["lang"] || "en",
    })
  ),

  check("newEmail")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "newEmailRequired",
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
    .custom(async (val, { req }) => {
      //1) verify new email
      const emailUser = await UserModel.findOne({ email: val });
      if (emailUser) {
        throw new Error(
          i18n.__({
            phrase: "emailAlreadyUse",
            locale: req.headers["lang"] || "en",
          })
        );
      }

      //2) verify current password
      const user = await UserModel.findById(req.userModel._id);
      if (!user) {
        throw new Error(
          i18n.__({
            phrase: "thereIsNoUserWithId",
            locale: req.headers["lang"] || "en",
          })
        );
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error(
          i18n.__({
            phrase: "incorrectCurrentPassword",
            locale: req.headers["lang"] || "en",
          })
        );
      }

      return true;
    }),
  validatorMiddleware,
];
