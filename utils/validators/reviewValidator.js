const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const reviewModel = require('../../modules/reviewModel')

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
]

exports.createReviewValidator = [
  check('title').optional(),

  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),

  check('user').isMongoId().withMessage('Invalid user id format'),

  check('store')
    .isMongoId()
    .withMessage('Invalid store id format')
    .custom((val, { req }) =>
      //check if logged user create review before

      reviewModel
        .findOne({ user: req.body.user, store: req.body.store })
        .then((review) => {
          if (review) {
            console.log(req.body.user)
            console.log(req.body.store)
            return Promise.reject(
              new Error('you already created a review before'),
            )
          }
        }),
    ),

  validatorMiddleware,
]

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      //check review owership before update
      reviewModel
        .findById(val)
        .then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`),
            )
          }

          if (review.user._id.toString() !== req.body.user.toString() ) {


            return Promise.reject(
              new Error(`you are not allowed to perform this action`),
            )
          }


        }),
    ),

  validatorMiddleware,
]

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format").custom((val,{req})=>{
    //check review ownership before update
 if(req.userModel.role==="user"){
  return reviewModel.findById(val).then((review)=>{
     if(!review){
       return Promise.reject(
         new Error("there is no review with id")
       );
     }
 
     if(review.user._id.toString() !== req.body.user.toString()){
       return Promise.reject(
         new Error("your are not allowed to perform this action")
       );
     }
   })
 }
 return true
 }),
  validatorMiddleware,
]
