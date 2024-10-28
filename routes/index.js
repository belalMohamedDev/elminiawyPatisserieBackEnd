const categoryRoute = require("./categoryRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const subCategoryRoute = require("./subCategoryRoute");
const addressRoute = require("./userAddressRoute");
const addressStoreRoute = require("./addressStoreRoute");
const bannerRoute = require("./bannerRoute");
const productRoute = require("./productRoute");
const reviewRoute = require("./reviewRoute");
const wishListRoute = require("./wishListRoute");
const CouponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const notificationRoute = require("./notificationRoute");
const driverRoute = require("./driverRoute");

const mountRoute = (app) => {
  app.use("/v1/api/categories", categoryRoute);
  app.use("/v1/api/subCategories", subCategoryRoute);
  app.use("/v1/api/user", userRoute);
  app.use("/v1/api/auth", authRoute);
  app.use("/v1/api/address", addressRoute);
  app.use("/v1/api/store/address", addressStoreRoute);
  app.use("/v1/api/banner", bannerRoute);
  app.use("/v1/api/reviews", reviewRoute);
  app.use("/v1/api/product", productRoute);
  app.use("/v1/api/wishList", wishListRoute);
  app.use("/v1/api/coupon", CouponRoute);
  app.use("/v1/api/cart", cartRoute);
  app.use("/v1/api/order", orderRoute);
  app.use("/v1/api/notification", notificationRoute);
  app.use("/v1/api/driver", driverRoute);
};

module.exports = mountRoute;
