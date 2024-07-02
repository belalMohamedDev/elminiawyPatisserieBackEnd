const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const notificationChildModel = mongoose.model(
  "notification",
  notificationSchema
);

module.exports = notificationChildModel;
