
const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");


// @ dec update logged user data
// @ route Update  /api/vi/user/updateMyData
// @ access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {

    //update user data based user payload
    const document = await userModel.findByIdAndUpdate(
      req.userModel._id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true }
    );
  
    res.status(200).json({
      status: true,
      message: `Sucess To Update User data from this id`,
      data: document,
    });
  });
  