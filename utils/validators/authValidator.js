const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../modules/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error("E-mail already in use");
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number, only accepted for Egypt and Saudi Arabia"
    ),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("This role is not found"),
    

  check("branchAddress")
    .optional()
    .isMongoId()
    .withMessage("Invalid branch Address format"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid email address format"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),

  validatorMiddleware,
];

exports.tokenRefreshValidator = [
  check("refreshToken").notEmpty().withMessage("refresh Token required"),

  validatorMiddleware,
];

exports.logOutValidator = [
  check("refreshToken").notEmpty().withMessage("refresh Token required"),

  validatorMiddleware,
];

exports.restPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid email address format"),


  check("newPassword")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.passwordConfirm) {
        throw new Error("password or password confirmation incorrect");
      }
      return true;
    }),


    check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  validatorMiddleware,
];
