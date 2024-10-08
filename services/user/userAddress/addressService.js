const addressModel = require("../../../modules/userAddressModel");
const asyncHandler = require("express-async-handler");
const factory = require("../../handleFactor/handlerFactory");
const i18n = require("i18n");

//passing data to body in create and update
const passingDataToReqBody = (req, res, next) => {
  const { latitude, longitude, ...rest } = req.body;

  const newBody = {
    user: req.userModel._id,
    ...rest,
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

// @ dec delete specific address
// @ route Update  /api/vi/address/id
// @ access protected
const deleteAddress = asyncHandler(async (req, res, next) => {
  await addressModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      active: false,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: true,
    message: i18n.__("SucessToDeleteDataFromThisId"),
  });
});

//using to get all address user login
const createFilterObject = (req, res, next) => {
  req.filterObject = { user: req.userModel._id , active: true};
  next();
};

// @ dec create address
// @ route Post  /api/vi/address
// @ access protected
const creatAddress = factory.creatOne(addressModel, "address");

// @ dec get all  address data
// @ route Get  /api/vi/address
// @ access protected
const getAllAddress = factory.getAllData(addressModel, "address",addressModel);


// @ dec delete specific address
// @ route Update  /api/vi/address/id
// @ access protected
// const deleteAddress = factory.deleteOne(addressModel, "address");

// @ dec update specific address
// @ route Update  /api/vi/address/id
// @ access protected
const updateAddress = factory.updateOne(addressModel, "address");

module.exports = {
  creatAddress,
  passingDataToReqBody,
  deleteAddress,
  getAllAddress,
  createFilterObject,
  updateAddress,
};
