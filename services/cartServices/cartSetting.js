const asyncHandler = require("express-async-handler");
const i18n = require("i18n");

const SettingsModel = require("../../modules/settingCartModel");

exports.cardSetting = asyncHandler(async (req, res, next) => {
  const { taxRate, shippingRate } = req.body;

  const settings = await SettingsModel.findOne();
  if (settings) {
    settings.taxRate = taxRate;
    settings.shippingRate = shippingRate;
    await settings.save();
  } else {
    await SettingsModel.create({ taxRate, shippingRate });
  }

  res.status(200).json({
    status: true,
    message: i18n.__("settingsUpdatedSuccessfully"),
  });
});
