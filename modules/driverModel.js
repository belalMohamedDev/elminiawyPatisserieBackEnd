const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {

   region: {
    type: String,
    trim: true,
    required: [true, "Address region required"],
    minlength: [3, "too short Address region"],
    maxlength: [300, "too long Address region"],
  },

  

  
  deliveryType: {
    type: String,
    enum: ["freelancer", "salaryBased"],
    default: "salaryBased",
  },
    
  images: [String],
  publicIds: [String],

  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },

  typeOfTheVehicle: {
    type: String,
    enum: ["car", "withOutAVehicle", "bicycle", "motorcycle"],
    default: "motorcycle",
  },

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },

  nationalId: {
    type: String,
    trim: true,
    required: [true, "National Id required"],
    minlength: [14, "too short National Id"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },


  },
  { timestamps: true }
);


driverSchema.index({ location: '2dsphere' });

const driverModel = mongoose.model("driver", driverSchema);

module.exports = driverModel;
