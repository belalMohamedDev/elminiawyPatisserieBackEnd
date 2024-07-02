const storeAddressModel = require("../../../modules/storeAddressModel");
const factory = require("../../handleFactor/handlerFactory");

//passing data to body in create and update
exports.passingDataToReqBody = (req, res, next) => {
  const { latitude, longitude, BranchArea, briefness, region } = req.body;

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

  req.body = newBody;

  next();
};

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
