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
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      minlength: [3, "Banner title is too short"],
      maxlength: [100, "Banner title is too long"],
    },
    startDate: {
      type: Date,
      required: [true, "Banner start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Banner end date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    discount: {
      type: Number,
      required: [true, "Banner discount required"],
    },
  
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", BannerSchema);

module.exports = BannerModel;
