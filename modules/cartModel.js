const mongoose = require("mongoose");
const SettingsModel = require("./settingCartModel");

// Define the CartItem schema
const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number },
});

const CartSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    cartItems: [cartItemSchema],
    totalCartPrice: Number,
    couponDiscount: { type: Number, default: 0.0 },
    totalPriceAfterDiscount: { type: Number, default: 0.0 },
    taxPrice: Number,
    shippingPrice: Number,
    totalOrderPrice: Number,
  },
  { timestamps: true }
);

// Pre-save hook to calculate the total price for each cart item
cartItemSchema.pre("save", function (next) {
  this.totalItemPrice = this.price * this.quantity;
  next();
});

CartSchema.pre("save", async function (next) {
  this.totalCartPrice = this.cartItems.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );

  const settings = await SettingsModel.findOne();

  this.taxPrice =
    this.totalCartPrice == 0
      ? settings.taxRate
      : (settings.taxRate || 0) * this.totalCartPrice;

  this.shippingPrice = settings.shippingPrice || 0;

  const discount = (this.couponDiscount * this.totalCartPrice) / 100;
  this.totalPriceAfterDiscount = parseFloat(
    (this.totalCartPrice - discount).toFixed(2)
  );

  this.totalOrderPrice =
    this.totalPriceAfterDiscount != 0
      ? this.totalPriceAfterDiscount + this.taxPrice + this.shippingPrice
      : this.totalCartPrice + this.taxPrice + this.shippingPrice;

  next();
});

cartItemSchema.pre("save", function (next) {
  this.populate({
    path: "user",
    select: "name email phone",
  }).populate({
    path: "cartItems.product",
    select: "title image ratingsAverage",
  });

  next();
});

CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone",
  }).populate({
    path: "cartItems.product",
    select: "title image ratingsAverage",
  });

  next();
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
