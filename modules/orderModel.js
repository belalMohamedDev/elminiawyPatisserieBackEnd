const mongoose = require("mongoose");

// Define the CartItem schema
const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  options: [
    {
      optionName: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 },
    },
  ],
  customizations: [
    {
      name: { type: String },
      choice: {
        name: { type: String },
        additionalPrice: { type: Number },
      },
    },
  ],

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
      type: String,
      enum: [
        "Pending",
        "Admin Approved",
        "In Transit",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

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

    totalOrderPrice: {
      type: Number,
    },

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

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
      select: "title image ",
    })
    .populate({
      path: "shippingAddress",
    });

  next();
});
const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
