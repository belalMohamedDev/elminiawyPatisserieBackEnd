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

const CartSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    notes: { type: String },
    cartItems: [cartItemSchema],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

// Pre-save hook to calculate the total price for each cart item
cartItemSchema.pre("save", function (next) {
  let baseTotal =
    (this.price +
      this.options.reduce((acc, option) => acc + option.additionalPrice, 0) +
      this.customizations.reduce(
        (acc, customization) => acc + customization.choice.additionalPrice,
        0
      )) *
    this.quantity;

  this.totalItemPrice = baseTotal;
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
