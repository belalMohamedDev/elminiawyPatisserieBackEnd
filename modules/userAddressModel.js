const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");


const UserAddressSchema = mongoose.Schema(
  {
  
    alias: {
      type: String,
      enum: ["Apartment", "House", "Office"],
      default: "Apartment",
    },

    buildingName: {
      type: String,
      trim: true,
      required: [true, "Address Building Name required"],
      minlength: [3, "too short Address Building Name"],
      maxlength: [1000, "too long Address Building Name"],
    },

    apartmentNumber: String,
    floor: String,
    region: {
      type: String,
      trim: true,
      i18n: true,
      required: [true, "Address region required"],
      minlength: [3, "too short Address region"],
      maxlength: [1000, "too long Address region"],
    },
    additionalDirections: String,
    streetName:String,
    phone: {
      type: String,
      required: [true, "phone required"],

    },
    addressLabel: String,

    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type:[Number],
      },
    },

    active: {
      type: Boolean,
      default: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    nearbyStoreAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },
  },
  { timestamps: true }
);

UserAddressSchema.index({ location: '2dsphere' });

UserAddressSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

const AddressModel = mongoose.model("UserAddress", UserAddressSchema);

module.exports = AddressModel;
