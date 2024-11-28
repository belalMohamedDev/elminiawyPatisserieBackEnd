const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      i18n: true,
      unique: [true, "Category must be uniqe"],
      required: [true, "Category is required"],
      minlength: [3, "Too short category title"],
      maxlength: [300, "Too long category title"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    image: String,
    publicId: String,
  },
  { timestamps: true }
);

categorySchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
