const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");

const ApiError = require("../../../utils/apiError/apiError");

// @ dec update  User Password
// @ route Update  /api/vi/user/changePassword/id
// @ access private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`Faild To get User data from this id ${id}`, 404));
  }

  res.status(200).json({
    status: true,
    message: `Sucess To Update User password `,
    data: document,
  });
});
