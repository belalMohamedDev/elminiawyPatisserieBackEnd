const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");

const creatToken = require("../../../utils/generate token/createToken");


// @ dec update logged user password
// @ route Update  /api/vi/user/updateMyPassword
// @ access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password based user payload
  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  //generate token
  const accessToken = creatToken(
    document._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );
  const refreshToken = creatToken(
    document._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  document.refreshToken = refreshToken;
  await document.save();


  res.status(200).json({
    status: true,
    message: `Sucess To Update User password from this id`,
    accessToken: accessToken,
    data: document,
  });
});
