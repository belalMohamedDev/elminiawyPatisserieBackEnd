const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Coupon title required"],
      unique: [true, "Coupon title must be unique"],
      minlength: [3, "too short Coupon title"],
      maxlength: [32, "too long Coupon title"],
    },

    expire: {
      type: Date,
      required: [true, "Coupon expire required"],
    },

    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
    },
  },
  { timestamps: true }
);



const CouponModel = mongoose.model("Coupon", CouponSchema);

module.exports = CouponModel;
