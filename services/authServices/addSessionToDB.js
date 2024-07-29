const userModel = require("../../modules/userModel");

exports.addSessionToDB = async (userId, refreshToken, deviceInfo) => {
  return await userModel.updateOne(
    { _id: userId },
    {
      $push: {
        sessions: {
          refreshToken,
          deviceInfo,
          createdAt: new Date(),
          lastUsedAt: new Date(),
        },
      },
    }
  );
};
