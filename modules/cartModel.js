const mongoose = require("mongoose");

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
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

// Pre-save hook to calculate the total price for each cart item
cartItemSchema.pre("save", function (next) {
  this.totalItemPrice = this.price * this.quantity;
  next();
});

// Pre-save hook to calculate the totalCartPrice and totalPriceAfterDiscount for the cart
CartSchema.pre("save", function (next) {
  this.totalCartPrice = this.cartItems.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );
  next();
});

CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone",
  }).populate({
    path: "cartItems.product",
    select: "title image ",
  });

  next();
});
const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
