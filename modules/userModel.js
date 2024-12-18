const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var mongooseI18n = require("mongoose-i18n-localize");

const sessionSchema = new mongoose.Schema(
  {
    refreshToken: { type: String },
    deviceInfo: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User Name is Required"],
    },

    email: {
      type: String,
      trim: true,
      unique: [true, "Email must be uniqe"],
      required: [true, "Email is required"],
      lowerCase: true,
    },

    password: {
      type: String,
      trim: true,
      minlength: [6, "Too shory user password"],
    },

    passwordChangedAt: Date,
    passwordRestExpire: Date,
    passwordRestCode: String,
    passwordRestVerified: Boolean,

    phone: String,

    driverActive: {
      type: Boolean,
    },
    driverRegion: {
      type: String,
      trim: true,
      minlength: [3, "too short Address region"],
      maxlength: [300, "too long Address region"],
    },

    storeAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },

    completeData: {
      type: Boolean,
    },

    image: String,
    publicId: String,

    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
    notifications: [
      {
        notificationId: { type: mongoose.Schema.ObjectId, ref: "notification" },
        isSeen: {
          type: Boolean,
          default: false,
        },
      },
    ],

    verifyAccount: Boolean,

    sessions: [sessionSchema],

    branchAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

//work in create data
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
