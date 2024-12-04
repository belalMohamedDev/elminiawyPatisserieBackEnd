const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    publicId: {
      type: String,
      required: [true, "Banner publicId is required"],
    },

    startDate: {
      type: Date,
      required: [true, "Banner start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Banner end date is required"],
    },

 
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", BannerSchema);

module.exports = BannerModel;
