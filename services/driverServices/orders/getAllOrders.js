const axios = require("axios");
const orderModel = require("../../../modules/orderModel");
const storeAddressModel = require("../../../modules/storeAddressModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const redis = require("../../../config/redisConnection");

function toJSONLocalizedOnly(orders, lang) {
  return orders.map((order) => {
  

    if (order.cartItems && Array.isArray(order.cartItems)) {
      order.cartItems.forEach((item) => {
        if (item.product && item.product.title) {
          item.product.title =
            item.product.title[lang] || item.product.title["en"];
        }
      });
    }

    if (order.shippingAddress && order.shippingAddress.region) {
      order.shippingAddress.region =
        order.shippingAddress.region[lang] ||
        order.shippingAddress.region["en"];
    }

    return order;
  });
}

async function getDistanceAndTime(driverLocation, orderLocation, lang) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?language=${lang}`,
      {
        params: {
          origins: `${driverLocation.lat},${driverLocation.lng}`,
          destinations: `${orderLocation.lat},${orderLocation.lng}`,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const data = response.data;

    if (data.rows[0].elements[0].status === "OK") {
      return {
        distance: data.rows[0].elements[0].distance.text, // e.g., "5 km"
        duration: data.rows[0].elements[0].duration.text, // e.g., "10 mins"
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    return null;
  }
}

// @desc Get all orders for drivers
// @route GET /api/v1/driver/getNewOrders
// @access Private to drivers
exports.getAllDriverOrders = asyncHandler(async (req, res) => {
  // 1. Attempt to retrieve branches data from Redis cache
  let branchesInRegion = await redis.get(
    `branches:${req.userModel.driverRegion}-${JSON.stringify(req.headers["lang"] || "en")}`
  );

  // 2. If branches data is not in Redis, fetch from MongoDB
  if (!branchesInRegion) {
    branchesInRegion = await storeAddressModel
      .find({ "BranchArea.en": req.userModel.driverRegion })
      .select("_id")
      .lean();

    // 3. Store branches data in Redis cache for 1 hour
    await redis.set(
      `branches:${req.userModel.driverRegion}-${JSON.stringify(req.headers["lang"] || "en")}`,
      JSON.stringify(branchesInRegion),
      "EX",
      60 * 60
    );
  } else {
    branchesInRegion = JSON.parse(branchesInRegion);
  }

  // 4. Retrieve all orders based on the nearby store addresses
  const getAllOrders = await orderModel
    .find({
      nearbyStoreAddress: { $in: branchesInRegion.map((branch) => branch._id) },
      status: 2,
      canceledByDrivers: { $nin: [req.userModel._id] },
    })
    .select("user shippingAddress totalOrderPrice")
    .limit(5)
    .lean();

  // 5. Extract `driverLocation` from request body and validate
  const driverLocation = {
    lat: req.body.latitude,
    lng: req.body.longitude,
  };

  // Validate the presence of `latitude` and `longitude` in the body
  if (!driverLocation.lat || !driverLocation.lng) {
    return res.status(400).json({
      status: false,
      message: i18n.__("DriverLocationRequired"),
    });
  }

  const ordersWithDistance = await Promise.all(
    getAllOrders.map(async (order) => {
      const orderLocation = {
        lat: order.shippingAddress.location.coordinates[1],
        lng: order.shippingAddress.location.coordinates[0],
      };

      const distanceData = await getDistanceAndTime(
        driverLocation,
        orderLocation,
        req.headers["lang"] || "en"
      );
      return {
        ...order,
        distance: distanceData ? distanceData.distance : null,
        duration: distanceData ? distanceData.duration : null,
      };
    })
  );

  // Localize the document based on the preferred language
  const localizedDocument = toJSONLocalizedOnly(
    ordersWithDistance,
    req.headers["lang"] || "en"
  );

  // 6. Send the response with retrieved orders data
  res.status(200).json({
    status: true,
    message: i18n.__("SuccessToGetAllOrders"),
    data: localizedDocument,
  });
});
