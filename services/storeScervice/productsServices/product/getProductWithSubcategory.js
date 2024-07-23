const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const redis = require("../../../../config/redisConnection");

const productModel = require("../../../../modules/productModel");
const SubCategory = require("../../../../modules/subCategoryModel");




///////////////////////////////////////////////

async function getProductsBySubCategory(subCategoryIds,langHeaders) {
  const products = await productModel
    .find({
      subCategory: { $in: subCategoryIds },
    })
    .exec();

  var localizedProducts = productModel.schema.methods.toJSONLocalizedOnly(
    products,
    langHeaders
  );
  return localizedProducts;
}

//////////////////////////////////////////
async function getSubCategoriesByCategory(categoryId, langHeaders) {
  const subCategories = await SubCategory.find({
    category: categoryId,
  }).exec();

  var localizedSubCategory = SubCategory.schema.methods.toJSONLocalizedOnly(
    subCategories,
    langHeaders
  );

  return localizedSubCategory;
}

// @desc get All Products Belongs To subCategory
// @route GET /api/v1/product/:categoryId
// @access Public
exports.getAllProductsBelongsTosubCategory = asyncHandler(
  async (req, res, next) => {
    const { categoryId } = req.params;
    const langHeaders = req.headers["lang"] || "en";

    // Check Redis cache first
    const cacheKey = `${categoryId}-${JSON.stringify(req.headers["lang"] || "en")}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // First, get all subcategories for the category
    const subCategories = await getSubCategoriesByCategory(
      categoryId,
      langHeaders
    );

    // Collect all subcategory IDs
    const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

    // Then, get all products for these subcategories
    const products = await getProductsBySubCategory(
      subCategoryIds,
      langHeaders
    );

    // Map products to their respective subcategories
    const productsBySubCategory = subCategories.map((subCategory) => {
      return {
        id: subCategory._id,
        title: subCategory.title,
        products: products.filter((product) =>
          product.subCategory.equals(subCategory._id)
        ),
      };
    });

    // Cache the response for one day (86400 seconds)
    await redis.set(
      cacheKey,
      JSON.stringify({
        status: true,
        message: i18n.__("StoreGetAllProductsSubCategory"),
        AllProducts: products,
        data: productsBySubCategory,
      }),
      { EX: 60 }
    );

    res.status(200).json({
      status: true,
      message: i18n.__("StoreGetAllProductsSubCategory"),
      AllProducts: products,
      data: productsBySubCategory,
    });
  }
);
