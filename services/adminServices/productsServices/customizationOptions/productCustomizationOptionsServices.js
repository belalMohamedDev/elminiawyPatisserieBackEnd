const asyncHandler = require('express-async-handler')

const productModel = require('../../../../modules/productModel')

const factory = require('../../../handleFactor/handlerFactory')
const ApiError = require('../../../../utils/apiError/apiError')



// @ dec update customization Options to product
// @ route put  /api/vi/product//customizationOptions/:productId/customization-options/:optionId/choices/:choiceId
// @ access private /StoreOwner/admin
exports.updateProductCustomizationOptions = asyncHandler(
  async (req, res, next) => {
    const { productId, optionId, choiceId } = req.params
    const { name, additionalPrice } = req.body

    // Find the product and update the specific choice in the customization option
    const product = await productModel.findOneAndUpdate(
      {
        _id: productId,
        'customizationOptions._id': optionId,
        'customizationOptions.choices._id': choiceId,
      },
      {
        $set: {
          'customizationOptions.$[option].choices.$[choice].name': name,
          'customizationOptions.$[option].choices.$[choice].additionalPrice': additionalPrice,
        },
      },
      {
        new: true,
        arrayFilters: [{ 'option._id': optionId }, { 'choice._id': choiceId }],
      },
    )

    // Check if the product was found and updated
    if (!product) {
      return next(
        new ApiError(
          `Failed to find product with ID ${productId} or customization option with ID ${optionId} or choice with ID ${choiceId}`,
          404,
        ),
      )
    }

    // Send a success response with the updated product
    res.status(200).json({
      status: true,
      message: `Successfully updated choice in customization option of product`,
      data: product,
    })
  },
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec add new customizationOptions to product
// @ route Post  /api/vi/product/customizationOptions/:id
// @ access private /StoreOwner/admin
exports.addProductCustomizationOptions = factory.addOneToList(
  productModel,
  'product customization Options',
  'customizationOptions',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete customizationOptions from product
// // @ route delete  /api/vi/product/customizationOptions/:id
// // @ access private /StoreOwner/admin
exports.removeProductCustomizationOptions = factory.removeOneFromList(
  productModel,
  'product customization Options',
  'customizationOptions',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all customizationOptions data from product query
// @ route get  /api/vi/product/customizationOptions/:id
// @ access public
exports.getAllProductCustomizationOptions = factory.getAllDataFromList(
  productModel,
  'product customization Options',
  'customizationOptions',
)
