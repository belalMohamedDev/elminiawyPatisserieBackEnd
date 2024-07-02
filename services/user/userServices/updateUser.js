const userModel = require('../../../modules/userModel')

const factory = require('../../handleFactor/handlerFactory')

// @ dec update specific User
// @ route Update  /api/vi/user/id
// @ access Private
exports.updateUser = factory.updateOne(userModel, 'User')

// @ dec delete photo from cloud using when update
exports.deleteImageBeforeUpdate = factory.deletePhotoFromCloud(userModel)

