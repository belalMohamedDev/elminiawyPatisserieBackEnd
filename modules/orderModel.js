const mongoose = require("mongoose");

// Define the CartItem schema

const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number },
});

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    notes: { type: String },

    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },

    driverId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    adminAcceptedAt: Date,

    adminCompletedAt: Date,
    canceledAt: Date,

    paitAt: Date,

    cartItems: [cartItemSchema],

    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "UserAddress",
    },

    nearbyStoreAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },

    totalOrderPrice: {
      type: Number,
    },

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    canceledByDrivers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    isPaid: {
      type: Boolean,
      default: false,
    },
    paitAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name image email phone",
  })
    .populate({
      path: "cartItems.product",
      select: "title image ratingsAverage ",
    })
    .populate({
      path: "shippingAddress",
    });

  next();
});

OrderSchema.index({ nearbyStoreAddress: 1, status: 1, canceledByDrivers: 1 });

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
