const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

const productSchema = mongoose.Schema({
  title: { type: String, required: true, i18n: true },

  description: { type: String, required: true, i18n: true },
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

  ratingsAverage: {
    type: Number,
    min: [0, "rating must be above or equal 0.0"],
    max: [5, "rating must be below or equal 5.0"],
    default: 0.0,
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


productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title",
  }).populate({
    path: "subCategory",
    select: "title",
  });

  next();
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
