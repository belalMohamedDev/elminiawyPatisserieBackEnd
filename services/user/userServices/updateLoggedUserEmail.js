const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");
const { getDeviceInfo } = require("../../../utils/getDeviceInfo/getDeviceInfo");
const { addSessionToDB } = require("../../authServices/addSessionToDB");

const creatToken = require("../../../utils/generate token/createToken");

// @ dec update logged user email
// @ route Update  /api/vi/user/updateMyEmailAddress
// @ access private/protect
exports.updateLoggedUserEmail = asyncHandler(async (req, res, next) => {
  //update user password based user payload
  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      email: req.body.newEmail,
    },
    {
      new: true,
    }
  );

  const deviceInfo = JSON.stringify(getDeviceInfo(req));

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

  await addSessionToDB(document._id, refreshToken, deviceInfo);

  // Remove old sessions if needed
  await removeOldSessions(document);

  res.status(200).json({
    status: true,
    message:i18n.__("sucessToUpdateUserEmail") ,
    accessToken: accessToken,
    data: sanitizeUser(document, refreshToken),
  });
});

const removeOldSessions = async (user) => {
  const maxSessions = 5;

  if (user.sessions.length > maxSessions) {
    user.sessions.sort((a, b) => a.createdAt - b.createdAt);
    user.sessions = user.sessions.slice(-maxSessions);
    await user.save();
  }
};
