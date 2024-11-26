const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../modules/categoryModel");
const subCategoryModel = require("../../modules/subCategoryModel");
const i18n = require("i18n");

exports.getProductValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidProductIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "productTitleEnglishRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("title.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "productTitleArabicRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("description.en")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "ProductDescriptionEnglishRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("description.ar")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "ProductDescriptionArabicRequired",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("price")
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "pricePositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  // check("category")
  //   .notEmpty()
  //   .withMessage((value, { req }) =>
  //     i18n.__({
  //       phrase: "catogryIdRequired",
  //       locale: req.headers["lang"] || "en",
  //     })
  //   )
  //   .isMongoId()
  //   .withMessage((value, { req }) =>
  //     i18n.__({
  //       phrase: "InvalidCategoryIdFormat",
  //       locale: req.headers["lang"] || "en",
  //     })
  //   ),
  // .custom(
  //   asyncHandler(async (val, { req }) => {
  //     const document = await categoryModel.findOne({ _id: val });
  //     if (!document) {
  //       throw new Error(
  //         i18n.__({
  //           phrase: "categoryIdNotFound",
  //           locale: req.headers["lang"] || "en",
  //         })
  //       );
  //     }
  //   })
  // ),

  check("subCategory")
    .notEmpty()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "subCategoryIdRequired",
        locale: req.headers["lang"] || "en",
      })
    )
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidSubCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await subCategoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "subCategoryIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }

        req.body.category = document.category;

        // if (document.category != req.body.category) {
        //   throw new Error(
        //     i18n.__({
        //       phrase: "categoryIdNotMatching",
        //       locale: req.headers["lang"] || "en",
        //     })
        //   );
        // }
      })
    ),

  check("options.*.optionName").optional(),
  check("options.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "additionalPositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("customizationOptions.*.name").optional(),
  check("customizationOptions.*.choices.*.name").optional(),

  check("customizationOptions.*.choices.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "additionalPositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidProductIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  check("title.en").optional(),

  check("title.ar").optional(),

  check("description.en").optional(),

  check("description.ar").optional(),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "pricePositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("category")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "categoryIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidSubCategoryIdFormat",
        locale: req.headers["lang"] || "en",
      })
    )
    .custom(
      asyncHandler(async (val, { req }) => {
        const document = await subCategoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error(
            i18n.__({
              phrase: "subCategoryIdNotFound",
              locale: req.headers["lang"] || "en",
            })
          );
        }
      })
    ),

  check("options.*.optionName").optional(),
  check("options.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "additionalPositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  check("customizationOptions.*.name").optional(),
  check("customizationOptions.*.choices.*.name").optional(),

  check("customizationOptions.*.choices.*.additionalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "additionalPositiveNumber",
        locale: req.headers["lang"] || "en",
      })
    ),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage((value, { req }) =>
      i18n.__({
        phrase: "InvalidProductIdFormat",
        locale: req.headers["lang"] || "en",
      })
    ),
  validatorMiddleware,
];
