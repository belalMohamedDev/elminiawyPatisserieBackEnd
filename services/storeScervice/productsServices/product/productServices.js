const {
  uploadToCloudinary,
} = require("../../../../middleware/cloudinaryMiddleWare");

const {
  uploadSingleImage,
} = require("../../../../middleware/imageUploadMiddleware");
const { resizeImage } = require("../../../../middleware/resizeImage");
const productModel = require("../../../../modules/productModel");
const factory = require("../../../handleFactor/handlerFactory");

//upload single image
exports.uploadProductImage = uploadSingleImage("image");

// resize image before upload
exports.resizeProductImage = resizeImage("product");

// upload image in cloud
exports.uploadImageInCloud = uploadToCloudinary();

//passing data to body in create
exports.passingDataToReqBody = (req, res, next) => {
  const {
    optionName,
    optionAdditionalPrice,
    customizationOptionsName,
    customizationOptionsChoicesName,
    customizationOptionsChoicesAdditionalPrice,

    ...rest
  } = req.body;


  const newOptions = optionName
    ? [
        {
          optionName: optionName,
          additionalPrice: optionAdditionalPrice,
        },
      ]
    : [];


  const newCustomizationOptions = customizationOptionsName
    ? [
        {
          name: customizationOptionsName,
          choices: customizationOptionsChoicesName
            ? [
                {
                  name: customizationOptionsChoicesName,
                  additionalPrice: customizationOptionsChoicesAdditionalPrice,
                },
              ]
            : [],
        },
      ]
    : [];

  req.body = {
    ...rest,
    options: newOptions,
    customizationOptions: newCustomizationOptions,
  };

  next();
};

// @ dec add new product to store
// @ route Post  /api/vi/product
// @ access private /admin
exports.createNewProduct = factory.creatOne(productModel, "product");

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec delete product to store
// @ route delete  /api/vi/product/:productId
// @ access private /admin
exports.deleteProduct = factory.deleteOne(productModel, "product");

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec get specific product by id
// @ route get  /api/vi/product/:productId
// @ access public
exports.getSpecificProduct = factory.getOne(productModel, "product");

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec update product to store
// @ route put  /api/vi/product/:productId
// @ access private /admin
exports.updateProduct = factory.updateOne(productModel, "product");

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// @ dec get all  product to store
// @ route Get  /api/vi/product
// @ access public
exports.getAllProduct = factory.getAllData(productModel, "product");
