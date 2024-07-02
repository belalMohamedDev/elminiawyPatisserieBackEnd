const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const productModel = require("../../../../modules/productModel");

// @desc get All Products Belongs To subCategory
// @route GET /api/v1/product/:categoryId
// @access Public
exports.getAllProductsBelongsTosubCategory = asyncHandler(
    async (req, res, next) => {
      const { categoryId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid category ID",
        });
      }
  
      const document = await productModel.aggregate([
        {
          $match: { category: mongoose.Types.ObjectId(categoryId) },
        },
        {
          $lookup: {
            from: "subCategories", 
            localField: "subCategory",
            foreignField: "_id",
            as: "subcategoryDetails",
          },
        },
        {
          $unwind: "$subcategoryDetails",
        },
        {
          $group: {
            _id: {
              subcategoryId: "$subcategoryDetails._id",
              subcategoryName: "$subcategoryDetails.name",
            },
            products: { $push: "$$ROOT" },
          },
        },
        {
          $group: {
            _id: null,
            subcategories: {
              $push: {
                _id: "$_id.subcategoryId",
                subCategoryName: "$_id.subcategoryName",
                products: "$products",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            subcategories: 1,
          },
        },
      ]);
  
      res.status(200).json({
        status: true,
        message: "Store get All Products Belongs To subCategory",
        data: document[0] || { subcategories: [] },
      });
    }
  );