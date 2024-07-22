const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, required: true },
  price: { type: Number, required: true },

  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Category id Required"],
  },

  subCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "subCategory",
    required: [true, "sub Category id Required"],
  },

  image: { type: String },
  publicId: { type: String },

  availability: { type: Boolean, default: true },

  unitOfSale: { type: String },

  ratingsAverage: {
    type: Number,
    min: [1, "rating must be above or equal 1.0"],
    max: [5, "rating must be below or equal 5.0"],
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  options: [
    {
      optionName: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 },
    },
  ],

  customizationOptions: [
    {
      name: { type: String },
      choices: [
        {
          name: { type: String },
          additionalPrice: { type: Number },
        },
      ],
    },
  ],
});

productSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
