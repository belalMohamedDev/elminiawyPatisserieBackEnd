const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

const StoreAddressSchema = new mongoose.Schema(
  {
    BranchArea: {
      type: String,
      trim: true,
      i18n: true ,
      required: [true, "branch area required"],
      minlength: [3, "too short branch area"],
      maxlength: [500, "too long branch area"],
    },

    briefness: {
      type: String,
      trim: true,
      i18n: true ,
      required: [true, "briefness required"],
      minlength: [3, "too short briefness"],
      maxlength: [500, "too long briefness"],
    },
    


    region: {
      type: String,
      trim: true,
      i18n: true ,
      required: [true, "Address region required"],
      minlength: [3, "too short Address region"],
    },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    deliveryZone: {
      type: {
        type: String, 
        enum: ["Polygon"], 
        required: true,
      },
      coordinates: {
        type: [[[Number]]], 
        required: true,
      },
    },


  },
  { timestamps: true }
);

StoreAddressSchema.index({ location: "2dsphere" });

StoreAddressSchema.index({ deliveryZone: "2dsphere" });

StoreAddressSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

StoreAddressSchema.index({ region: 1 });

const StoreAddressModel = mongoose.model("StoreAddress", StoreAddressSchema);

module.exports = StoreAddressModel;
