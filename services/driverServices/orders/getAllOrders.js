const orderModel = require("../../../modules/orderModel");
const driverModel = require("../../../modules/driverModel");
const storeAddressModel = require("../../../modules/storeAddressModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const redis = require("../../../config/redisConnection");
const { promisify } = require("util");
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);

// @desc Get all orders for drivers
// @route GET /api/v1/driver/getNewOrders
// @access Private to drivers

exports.getAllDriverOrders = asyncHandler(async (req, res) => {
  // 1. Retrieve driver data based on the logged-in user
  const driverData = await driverModel
    .findOne({ user: req.userModel._id })
    .select("region");

  // Check if driver data exists, if not, return a 404 response
  if (!driverData) {
    return res.status(404).json({
      status: false,
      message: i18n.__("DriverNotFound"),
    });
  }

  // 2. Attempt to retrieve branches data from Redis cache
  let branchesInRegion = await getAsync(`branches:${driverData.region}`);

  if (!branchesInRegion) {
    // 3. If branches data is not in Redis, fetch from MongoDB
    branchesInRegion = await storeAddressModel
      .find({ region: driverData.region })
      .select("_id")
      .lean();

    // 4. Store branches data in Redis cache for 1 hour
    await setAsync(
      `branches:${driverData.region}`,
      JSON.stringify(branchesInRegion),
      "EX",
      60 * 60
    );
  } else {
    // 5. Parse branches data from Redis cache
    branchesInRegion = JSON.parse(branchesInRegion);
  }

  // 6. Find all available orders in the driver's region, excluding orders canceled by the driver
  const getAllOrders = await orderModel
    .find({
      nearbyStoreAddress: { $in: branchesInRegion.map((branch) => branch._id) },
      status: 2,
      canceledByDrivers: { $nin: [req.userModel._id] },
    })
    .select("user.name shippingAddress totalOrderPrice")
    .limit(5)
    .lean();

  // 7. Send the response with retrieved orders data
  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllOrders"),
    data: getAllOrders,
  });
});
