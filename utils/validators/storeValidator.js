const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../../modules/categoryModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

// exports.getSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCatogry id format"),
//   validatorMiddleware,
// ];

exports.createStoreValidator = [
  check("StoreName")
    .notEmpty()
    .withMessage("Store name required")
    .isLength({ min: 3 })
    .withMessage("too short Store name")
    .isLength({ max: 100 })
    .withMessage("too long Store name"),

    check("StoreDescription")
    .notEmpty()
    .withMessage("Store Description required")
    .isLength({ min: 3 })
    .withMessage("too short Store Description")
    .isLength({ max: 200 })
    .withMessage("too long Store Description"),


    check("legalStoreName")
    .notEmpty()
    .withMessage("legal Store Name required")
    .isLength({ min: 3 })
    .withMessage("too short legal Store Name")
    .isLength({ max: 100 })
    .withMessage("too long legal Store Name"),



  check("category")
    .notEmpty()
    .withMessage("subCatogry id required")
    .isMongoId()
    .withMessage("Invalid Catogry id format")
    .custom(
      asyncHandler(async (val) => {
        const document = await categoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this category id not found");
        }
      })
    ),

  validatorMiddleware,
];

// exports.updateSubCatogryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCatogry id format"),

//   check("name")
//   .optional()
//   .isLength({ min: 3 })
//   .withMessage("too short subCatogry name")
//   .isLength({ max: 32 })
//   .withMessage("too long subCatogry name"),

// check("category")
//   .optional()
//   .isMongoId()
//   .withMessage("Invalid Catogry id format")
//   .custom(
//     asyncHandler(async (val) => {
//       const document = await categoryModel.findOne({ _id: val });
//       if (!document) {
//         throw new Error("this category id not found");
//       }
//     })
//   ),

//   validatorMiddleware,
// ];

// exports.deletesubCatogryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCatogry id format"),
//   validatorMiddleware,
// ];
