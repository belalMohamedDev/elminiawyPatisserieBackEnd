const subCategoryModel = require("../../modules/subCategoryModel");
const factory = require("../handleFactor/handlerFactory");

// @ dec create subCategory
// @ route Post  /api/vi/subCategory
// @ access private
const creatSubCategory = factory.creatOne(subCategoryModel, "subCategory");

// @ dec get all  subCategory data
// @ route Get  /api/vi/subCategory
// @ access public
const getAllSubCategory = factory.getAllData(subCategoryModel, "subCategory");

// @ dec get specific subCategory
// @ route Get  /api/vi/subCategory/id
// @ access public
const getOneSubCategory = factory.getOne(subCategoryModel, "subCategory");

// @ dec update specific subCategory
// @ route Update  /api/vi/subCategory/id
// @ access Private
const updateSubCategory = factory.updateOne(subCategoryModel, "subCategory");

// @ dec delete specific subCategory
// @ route Update  /api/vi/subCategory/id
// @ access Private
const deleteSubCategory = factory.deleteOne(subCategoryModel, "subCategory");

const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

module.exports = {
  creatSubCategory,
  getAllSubCategory,
  getOneSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObject,
};
