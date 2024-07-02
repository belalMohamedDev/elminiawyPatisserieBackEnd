const asyncHandler = require('express-async-handler')

const ApiError = require('../../utils/apiError/apiError')
const userModel = require('../../modules/userModel')

// @ dec log out
// @ route Post  /api/vi/auth/logout
// @ access Public
exports.logOut = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return next(new ApiError('Refresh Token is required', 400))
  }

  const user = await userModel.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null },
    { new: true },
  )
  if (!user) {
    return next(new ApiError('Invalid Refresh Token', 400))
  }


  res.status(201).json({
    status: true,
    message: `Logged out successfully`,
  })
})
