const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      required: [true, "password is required"],
      minlength: [6, "Too shory user password"],
    },

    passwordChangedAt: Date,
    passwordRestExpire: Date,
    passwordRestCode: String,
    passwordRestVerified: Boolean,

    phone: String,

    image: String,
    publicId: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    verifyAccount: Boolean,

    refreshToken: String,

    branchAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },

    wishList: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
