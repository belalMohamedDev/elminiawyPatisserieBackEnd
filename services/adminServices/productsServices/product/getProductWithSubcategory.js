const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const redis = require("../../../../config/redisConnection");

const productModel = require("../../../../modules/productModel");

const SubCategory = require("../../../../modules/subCategoryModel");

///////////////////////////////////////////////
const getUserWishlist = async (userModel) => {
  if (userModel) {
    return await userModel.populate("wishList");
  }
  return null;
};

const addWishlistStatus = (products, wishlist) => {
  return products.map((product) => {
    const isInWishlist = wishlist
      ? wishlist.some(
          (wishListItem) =>
            wishListItem._id.toString() === product._id.toString()
        )
      : false;
    return {
      ...product,
      in_wishlist: isInWishlist,
    };
  });
};

async function getProductsBySubCategory(subCategoryIds, langHeaders) {
  const products = await productModel
    .find({
      subCategory: { $in: subCategoryIds },
      active: true,
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
    active: true,
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

    // Get user wishlist and subcategories in parallel
    const [userWishList, subCategories] = await Promise.all([
      getUserWishlist(req.userModel),
      getSubCategoriesByCategory(categoryId, langHeaders),
    ]);

    // Collect all subcategory IDs
    const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

    // Get all products for these subcategories
    const products = await getProductsBySubCategory(
      subCategoryIds,
      langHeaders
    );

    // Add wishlist status
    const productsWithWishlistStatus = addWishlistStatus(
      products,
      userWishList ? userWishList.wishList : []
    );

    // Map products to their respective subcategories
    // const productsBySubCategory = subCategories.map((subCategory) => {
    //   return {
    //     id: subCategory._id,
    //     title: subCategory.title,
    //     products: productsWithWishlistStatus.filter((product) =>
    //       product.subCategory._id.equals(subCategory._id)
    //     ),
    //   };
    // });

    // Map products to their respective subcategories
    const productsBySubCategory = subCategories
      .map((subCategory) => {
        const subCategoryProducts = productsWithWishlistStatus.filter(
          (product) => product.subCategory._id.equals(subCategory._id)
        );

        return {
          id: subCategory._id,
          title: subCategory.title,
          products: subCategoryProducts,
        };
      })
      .filter((subCategory) => subCategory.products.length > 0); 

    // Cache the response for one day (86400 seconds)
    const response = {
      status: true,
      message: i18n.__("StoreGetAllProductsSubCategory"),
      AllProducts: productsWithWishlistStatus,
      data: productsBySubCategory,
    };

    await redis.set(cacheKey, JSON.stringify(response), { EX: 86400 });

    res.status(200).json(response);
  }
);
