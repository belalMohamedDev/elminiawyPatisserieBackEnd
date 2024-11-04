const storeAddressModel = require("../../../modules/storeAddressModel");
const factory = require("../../handleFactor/handlerFactory");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const redis = require("../../../config/redisConnection");

//passing data to body in create and update
exports.passingDataToReqBody = (req, res, next) => {
  const {
    latitude,
    longitude,
    BranchArea,
    briefness,
    region,
    deliveryZoneCoordinates,
  } = req.body;

  const newBody = {
    BranchArea,
    briefness,
    region,
  };

  if (latitude !== undefined && longitude !== undefined) {
    newBody.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  if (deliveryZoneCoordinates !== undefined) {
    newBody.deliveryZone = {
      type: "Polygon",
      coordinates: [deliveryZoneCoordinates], // Array of coordinates [[longitude, latitude], ...]
    };
  }

  req.body = newBody;

  next();
};

//  @dec    get all regin from stores address
//  @route  Get  /api/v1/storeAddress/region
//  @access Public
exports.getRegions = asyncHandler(async (req, res) => {
  // Check Redis cache first
  const cacheKey = `getRegions}`;

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  const regions = await storeAddressModel.find().select("BranchArea _id");
  var localizedRegions = storeAddressModel.schema.methods.toJSONLocalizedOnly(
    regions,
   "en"
  );

  // Cache the response for one day (86400 seconds)
  await redis.set(
    cacheKey,
    JSON.stringify({
      status: true,
      message: i18n.__("successToGetAllRegions"),
      data: localizedRegions,
    }),
    { EX: 60*60 }
  );

  res.status(200).json({
    status: true,
    message: i18n.__("successToGetAllRegions"),
    data: localizedRegions,
  });
});

//  @dec    create new branch address
//  @route  Post  /api/v1/storeAddress
//  @access Private (admin)
exports.createstoreAddress = factory.creatOne(
  storeAddressModel,
  "store Address"
);

//  @dec    get list of store Address
//  @route  Get  /api/v1/storeAddress?page=?&limit=?
//  @access Private (admin)
exports.getAllstoreAddresss = factory.getAllData(
  storeAddressModel,
  "store Address"
);

//  @dec    update  store Address by id
//  @route  Put  /api/v1/storeAddress/:id
//  @access Private (admin)
exports.UpdatestoreAddress = factory.updateOne(
  storeAddressModel,
  "store Address"
);

//  @dec    delete  store Address by id
//  @route  Delete  /api/v1/storeAddress/:id
//  @access Private (admin)
exports.deletestoreAddress = factory.deleteOne(
  storeAddressModel,
  "store Address"
);
