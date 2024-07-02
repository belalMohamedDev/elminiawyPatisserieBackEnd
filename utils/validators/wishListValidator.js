const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const productModel = require('../../modules/productModel')
const userModel = require('../../modules/userModel')


exports.creatWishListValidator = [
  check('product')
    .optional()
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom((val, { req }) =>
      //check if logged user create review before
      productModel.findById({ _id: req.body.product }).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error('Faild To get data from this product id '),
          )
        }
      }),
    ),

 

  validatorMiddleware,
]


exports.deleteItemFromWishListValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product or store  id format')
    .custom((val, { req }) => {
      //check whichList ownership before update
      if (req.userModel.role === 'user') {

        return userModel.findOne({'wishList._id' : req.body.id, }).then((whichList) => {
          if (!whichList) {
            return Promise.reject(new Error('there is no product or store  with this id'))
          }

          if (whichList._id.toString() !== req.params.id.toString()) {
            return Promise.reject(
              new Error('your are not allowed to perform this action'),
            )
          }
        })
      }
      return true
    }),
  validatorMiddleware,
]
