const orderModel = require("../../../modules/orderModel");
const storeAddressModel = require("../../../modules/storeAddressModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const redis = require("../../../config/redisConnection");

// @desc Get all orders for drivers
// @route GET /api/v1/driver/getNewOrders
// @access Private to drivers
exports.getAllDriverOrders = asyncHandler(async (req, res) => {
 
  // 1. Attempt to retrieve branches data from Redis cache
  let branchesInRegion = await redis.get(
    `branches:${req.userModel.driverRegion}`
  );

  // 2. If branches data is not in Redis, fetch from MongoDB
  if (!branchesInRegion) {
    branchesInRegion = await storeAddressModel
      .find({ "BranchArea.en": req.userModel.driverRegion }) // Fetch branches matching the driver's region
      .select("_id")
      .lean();

    // 3. Store branches data in Redis cache for 1 hour
    await redis.set(
      `branches:${req.userModel.driverRegion}`,
      JSON.stringify(branchesInRegion),
      "EX",
      60 * 60 // 1 hour
    );
  } else {
    // Parse the retrieved branches data from Redis
    branchesInRegion = JSON.parse(branchesInRegion);
  }

  // 4. Retrieve all orders based on the nearby store addresses
  const getAllOrders = await orderModel
    .find({
      nearbyStoreAddress: { $in: branchesInRegion.map((branch) => branch._id) }, // Filter by nearby branches
      status: 2, // Only include orders with status 2
      canceledByDrivers: { $nin: [req.userModel._id] }, // Exclude orders canceled by the current driver
    })
    .select("user shippingAddress totalOrderPrice") // Select required fields
    .limit(5) // Limit results to 5
    .lean();

  // 5. Send the response with retrieved orders data
  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllOrders"),
    data: getAllOrders,
  });
});
