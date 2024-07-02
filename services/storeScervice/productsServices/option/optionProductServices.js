const asyncHandler = require('express-async-handler')

const productModel = require('../../../../modules/productModel')

const factory = require('../../../handleFactor/handlerFactory')
const ApiError = require('../../../../utils/apiError/apiError')



// @ dec update  options to product
// @ route put  /api/vi/product/:productId/options/:optionsId
// @ access private /StoreOwner/admin
exports.updateProductOptions = asyncHandler(async (req, res, next) => {
    const { productId, optionsId } = req.params
    const { optionName, additionalPrice } = req.body
  
    // Find the product and update the specific choice in the customization option
    const product = await productModel.findOneAndUpdate(
      { _id: productId, 'options._id': optionsId },
   
      {
        $set: {
          'options.$.optionName': optionName,
          'options.$.additionalPrice': additionalPrice,
        },
      },
      { new: true },
    )
  
  
    // Check if the product was found and updated
    if (!product) {
      return next(
        new ApiError(
          `Failed to find product with ID ${productId} or options with ID ${optionsId}`,
          404,
        ),
      )
    }
  
    // Send a success response with the updated product
    res.status(200).json({
      status: true,
      message: `Successfully updated options in product`,
      data: product,
    })
  })
  

  
// @ dec add new option to product
// @ route Post  /api/vi/product/option/:id
// @ access private /StoreOwner/admin
exports.addProductOption = factory.addOneToList(productModel, 'product option','options')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete option from product
// // @ route delete  /api/vi/product/option/:id
// // @ access private /StoreOwner/admin
exports.removeProductOption = factory.removeOneFromList(productModel, 'product option','options')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all option data from product query
// @ route get  /api/vi/product/option/:id
// @ access public
exports.getAllProductOption = factory.getAllDataFromList(productModel, 'product option','options')







