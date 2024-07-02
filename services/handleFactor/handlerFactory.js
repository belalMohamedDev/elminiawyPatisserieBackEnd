const asyncHandler = require('express-async-handler')
const ApiError = require('../../utils/apiError/apiError')
const ApiFeatures = require('../../utils/apiFeatures/apiFeatures')

const {
  deleteImageFromCloudinary,
} = require('../../middleware/cloudinaryMiddleWare')

//@dec this function used to  create in mongo db
const creatOne = (model, modelName) =>
  asyncHandler(async (req, res) => {
    //this code to create
    const document = await model.create(req.body)

    //send success response
    res.status(201).json({
      status: true,
      message: `Successful ${modelName} creation`,
      data: document,
    })
  })

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  get all data from mongo db
const getAllData = (model, modelName) =>
  asyncHandler(async (req, res) => {
    //this code get all data
    let filter = {}
    if (req.filterObject) {
      filter = req.filterObject
    }

    //build query
    const countDocuments = await model.countDocuments()
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .pagination(countDocuments)
      .filter()
      .search()
      .limitfields()
      .sort()

    // Execute query
    const { mongooseQuery, paginationRuslt } = apiFeatures
    const document = await mongooseQuery

    //check when no data found in db
    if (!document[0]) {
      // send success response
      return res.status(200).json({
        status: true,
        message: `There is no data entry for this ${modelName} `,
      })
    }

    // send success response with data
    res.status(200).json({
      status: true,
      message: `Sucess To get all ${modelName} data`,
      paginationRuslt,
      data: document,
    })
  })

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  get one data from mongo db
const getOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    //this code get one data from db using id
    const document = await model.findById(id)
    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404),
      )
    }
    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To get ${modelName} data from this id`,
      data: document,
    })
  })

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

const deletePhotoFromCloud = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const document = await model.findById({ _id: id })

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get User data from this id ${id}`, 404),
      )
    }

    //delete old image
    if (req.body.image) {
      deleteImageFromCloudinary(document.publicId)
    } 
    next()
  })

//@dec this function used to  update  data from mongo db
const updateOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    //this code update data from db using id
    const document = await model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    })

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404),
      )
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To Update ${modelName} data from this id`,
      data: document,
    })
  })

/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  delete one  data from mongo db
const deleteOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const directorPath = `uploads/${modelName}`

    //this code delete data from db using id
    const document = await model.findByIdAndDelete({ _id: id })

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(
          `Faild To Delete ${modelName} data from this id ${id}`,
          404,
        ),
      )
    }

    req.body.directorUrl = directorPath

    if (document.image) {
      //delete old image
      deleteImageFromCloudinary(document.publicId)
    }

    await document.deleteOne();

    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To Delete ${modelName} data from this id`,
    })
  })

  /////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  remove data from list into database
const removeOneFromList = (model, modelName,itemAttribute) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    //this code update data from db using id
    const document = await model.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          [itemAttribute]: { _id: req.body.id},
        
        },
      },
      {
        new: true,
      }
    )

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404),
      )
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To add ${modelName} data `,
      data: document,
    })
  })


/////////////////////////////////////////////////////////////
////////////////////////////////
/////////////////////////////////////////////////////////////////

//@dec this function used to  add new  data to list into database
const addOneToList = (model, modelName,itemAttribute) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
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
    )

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404),
      )
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To add ${modelName} data `,
      data: document,
    })
  })


  //@dec this function used to  get all data from mongo db
const getAllDataFromList = (model, modelName,itemAttribute) =>
  asyncHandler(async (req, res) => {
    //this code get all data
    const { id } = req.params
   
    //build query
    const countDocuments = await model.countDocuments()
    const apiFeatures = new ApiFeatures(model.find( {_id: id}, itemAttribute), req.query)
      .pagination(countDocuments)
      .filter()
      .search()
      .limitfields()
      .sort()

    // Execute query
    const { mongooseQuery, paginationRuslt } = apiFeatures
    const document = await mongooseQuery

    //check when no data found in db
    if (!document[0]) {
      // send success response
      return res.status(200).json({
        status: true,
        message: `There is no data entry for this ${modelName} `,
      })
    }

    // send success response with data
    res.status(200).json({
      status: true,
      message: `Sucess To get all ${modelName} data`,
      paginationRuslt,
      data: document,
    })
  })

module.exports = {
  creatOne,
  getAllData,
  getOne,
  updateOne,
  deleteOne,
  deletePhotoFromCloud,
  addOneToList,
  removeOneFromList,
  getAllDataFromList
}
