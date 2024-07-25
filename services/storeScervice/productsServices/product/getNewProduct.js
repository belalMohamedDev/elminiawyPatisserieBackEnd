const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const redis = require("../../../../config/redisConnection");
const ApiFeatures = require("../../../../utils/apiFeatures/apiFeatures");

const productModel = require("../../../../modules/productModel");


// Helper function to get user wishlist
const getUserWishlist = async (userModel) => {
  if (userModel) {
    return await userModel.populate("wishList");
  }
  return null;
};

// Helper function to get cached data
const getCachedData = async (cacheKey) => {
  return await redis.get(cacheKey);
};

// Helper function to cache data
const cacheData = async (cacheKey, data) => {
  await redis.set(cacheKey, JSON.stringify(data), { EX: 86400 });
};

// Helper function to get product data
const getProductData = async (query) => {
  const countDocuments = await productModel.countDocuments();
  const apiFeatures = new ApiFeatures(productModel.find(), query)
    .pagination(countDocuments)
    .search('product')
    .sort();
  const { mongooseQuery, paginationRuslt } = apiFeatures;
  const products = await mongooseQuery;
  return { products, paginationRuslt };
};

// Helper function to localize products
const localizeProducts = (products, lang) => {
  return productModel.schema.methods.toJSONLocalizedOnly(products, lang || "en");
};

// Helper function to add wishlist status
const addWishlistStatus = (products, wishlist) => {
  return products.map((product) => {
    const isInWishlist = wishlist
      ? wishlist.some((wishListItem) =>
          wishListItem._id.toString() === product._id.toString()
        )
      : false;
    return {
      ...product,
      in_wishlist: isInWishlist,
    };
  });
};

// Main handler function
exports.getAllNewProduct = asyncHandler(async (req, res) => {
  const lang = req.headers["lang"] || "en";
  const cacheKey = `${req.userModel ? true : false}-${JSON.stringify(lang)}-${req.query.limit}-${req.query.keyword}`;

  // Parallel operations: get user wishlist, check Redis cache, and get product data
  const [userWishList, cachedData] = await Promise.all([
    getUserWishlist(req.userModel),
    getCachedData(cacheKey),
  ]);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  // Get product data and localize it
  const { products, paginationRuslt } = await getProductData(req.query);
  const localizedProducts = localizeProducts(products, lang);

  // Add wishlist status
  const productsWithWishlistStatus = addWishlistStatus(localizedProducts, userWishList ? userWishList.wishList : []);

  // Create response data
  const responseData = {
    status: true,
    paginationRuslt,
    message: i18n.__("SuccessToGetAllDataFor") + i18n.__('product'),
    data: productsWithWishlistStatus,
  };

  // Cache the response
  await cacheData(cacheKey, responseData);

  // Send response
  res.status(200).json(responseData);
});


