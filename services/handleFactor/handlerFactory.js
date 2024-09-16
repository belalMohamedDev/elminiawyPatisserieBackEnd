const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const redis = require("../../config/redisConnection");
const ApiError = require("../../utils/apiError/apiError");
const ApiFeatures = require("../../utils/apiFeatures/apiFeatures");

const {
  deleteImageFromCloudinary,
} = require("../../middleware/cloudinaryMiddleWare");

//clear cash from redis
const clearCacheKeys = async (modelName) => {
  const cachePattern = `${modelName}-*`;
  const keys = await redis.keys(cachePattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};

//@dec this function used to  create in mongo db
const creatOne = (model, modelName) =>
  asyncHandler(async (req, res) => {
    //this code to create
    const document = await model.create(req.body);

    //refresh redius data cash
    await clearCacheKeys(modelName);

    //return data language
    if (model.schema.methods.toJSONLocalizedOnly != undefined) {
      var localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    }

    //send success response
    res.status(201).json({
      status: true,
      message: i18n.__("Successful %s creation", i18n.__(modelName)),
      data: localizedDocument ? localizedDocument : document,
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  get all data from mongo db
const getAllData = (model, modelName, localizedModel) =>
  asyncHandler(async (req, res) => {
    //this code get all data
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    // Check Redis cache first
    const cacheKey = `${modelName}-${JSON.stringify(req.headers["lang"] || "en")}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    //build query
    const countDocuments = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .pagination(countDocuments)
      .filter()
      .search()
      .limitfields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationRuslt } = apiFeatures;
    const document = await mongooseQuery;

    let localizedDocument;
    if (model.schema.methods.toJSONLocalizedOnly) {
      localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    } else if (
      localizedModel &&
      localizedModel.schema.methods.toJSONLocalizedOnly
    ) {
      localizedDocument = localizedModel.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    } else {
      // Handle case where method is missing
      localizedDocument = document;
    }

    // Cache the response for one day (86400 seconds)
    await redis.set(
      cacheKey,
      JSON.stringify({
        status: true,
        message: i18n.__("SuccessToGetAllDataFor") + i18n.__(modelName),
        paginationRuslt,
        data: localizedDocument,
      }),
      { EX: 60 }
    );

    // send success response with data
    res.status(200).json({
      status: true,
      message: i18n.__("SuccessToGetAllDataFor") + i18n.__(modelName),
      paginationRuslt,
      data: localizedDocument ? localizedDocument : document,
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  get one data from mongo db
const getOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //this code get one data from db using id
    const document = await model.findById(id);

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(i18n.__("failedToGetDataById", i18n.__(modelName)), 404)
      );
    }

    if (model.schema.methods.toJSONLocalizedOnly != undefined) {
      var localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToGetDataFromThisId"),
      data: localizedDocument ? localizedDocument : document,
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

const deletePhotoFromCloud = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById({ _id: id });

    //check found data or no
    if (!document) {
      //send faild response

      return next(
        new ApiError(i18n.__("failedToGetDataById", i18n.__("User")), 404)
      );
    }

    //delete old image
    if (req.body.image) {
      deleteImageFromCloudinary(document.publicId);
    }
    next();
  });

//@dec this function used to  update  data from mongo db
const updateOne = (model, modelName, localizedModel) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    //this code update data from db using id
    const document = await model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(i18n.__("failedToUpdateDataById", i18n.__(modelName)), 404)
      );
    }

    let localizedDocument;
    if (model.schema.methods.toJSONLocalizedOnly) {
      localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    } else if (localizedModel && localizedModel.schema.methods.toJSONLocalizedOnly) {
      localizedDocument = localizedModel.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    } else {
      // Handle case where method is missing
      localizedDocument = document;
    }
    //send success respons
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToUpdateDataFromThisId"),
      data: localizedDocument ,
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  delete one  data from mongo db
const deleteOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const directorPath = `uploads/${modelName}`;

    //this code delete data from db using id
    const document = await model.findByIdAndDelete({ _id: id });

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(i18n.__("failedToDeleteDataById", i18n.__(modelName)), 404)
      );
    }

    req.body.directorUrl = directorPath;

    if (document.image) {
      //delete old image
      deleteImageFromCloudinary(document.publicId);
    }

    await document.deleteOne();

    //send success respons
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToDeleteDataFromThisId"),
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  remove data from list into database
const removeOneFromList = (model, modelName, itemAttribute) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    //this code update data from db using id
    const document = await model.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          [itemAttribute]: { _id: req.body.id },
        },
      },
      {
        new: true,
      }
    );

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(i18n.__("failedToGetDataById", i18n.__(modelName)), 404)
      );
    }

    if (model.schema.methods.toJSONLocalizedOnly != undefined) {
      var localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToRemoveData"),
      data: localizedDocument ? localizedDocument : document,
    });
  });

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  add new  data to list into database
const addOneToList = (model, modelName, itemAttribute) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //this code update data from db using id
    const document = await model.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: {
          [itemAttribute]: req.body,
        },
      },
      {
        new: true,
      }
    );

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(i18n.__("failedToGetDataById", i18n.__(modelName)), 404)
      );
    }

    if (model.schema.methods.toJSONLocalizedOnly != undefined) {
      var localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: i18n.__("SucessToAddData"),
      data: localizedDocument ? localizedDocument : document,
    });
  });

//@dec this function used to  get all data from mongo db
const getAllDataFromList = (model, modelName, itemAttribute) =>
  asyncHandler(async (req, res) => {
    //this code get all data
    const { id } = req.params;

    // Check Redis cache first
    const cacheKey = `${modelName}-${JSON.stringify(req.headers["lang"] || "en")}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    //build query
    const countDocuments = await model.countDocuments();
    const apiFeatures = new ApiFeatures(
      model.find({ _id: id }, itemAttribute),
      req.query
    )
      .pagination(countDocuments)
      .filter()
      .search()
      .limitfields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationRuslt } = apiFeatures;
    const document = await mongooseQuery;

    if (model.schema.methods.toJSONLocalizedOnly != undefined) {
      var localizedDocument = model.schema.methods.toJSONLocalizedOnly(
        document,
        req.headers["lang"] || "en"
      );
    }

    //check when no data found in db
    if (!document[0]) {
      // send success response
      return res.status(200).json({
        status: true,
        message: i18n.__("ThereIsNoDataEntryForThis") + i18n.__(modelName),
      });
    }

    // Cache the response for one day (86400 seconds)
    await redis.set(
      cacheKey,
      JSON.stringify({
        status: true,
        message: i18n.__("SuccessToGetAllDataFor") + i18n.__(modelName),
        paginationRuslt,
        data: localizedDocument ? localizedDocument : document,
      }),
      "EX",
      86400
    ); // Cache for 1 day

    // send success response with data
    res.status(200).json({
      status: true,
      message: i18n.__("SuccessToGetAllDataFor") + i18n.__(modelName),
      paginationRuslt,
      data: localizedDocument ? localizedDocument : document,
    });
  });

module.exports = {
  creatOne,
  getAllData,
  getOne,
  updateOne,
  deleteOne,
  deletePhotoFromCloud,
  addOneToList,
  removeOneFromList,
  getAllDataFromList,
};
