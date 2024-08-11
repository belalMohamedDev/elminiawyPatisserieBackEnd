const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
  taxRate: { type: Number, default: 0.1 },
  shippingPrice: { type: Number, default: 50 },
});

const SettingsModel = mongoose.model("Settings", settingsSchema);

module.exports = SettingsModel;
