const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");

// @ dec delete logged user
// @ route Update  /api/vi/user/deleteMe
// @ access private/protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  //delete user  based user payload

  await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: true,
    message: `Sucess To delete User`,
  });
});
