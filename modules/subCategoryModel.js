const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      i18n: true,
      required: [true, "subCategory is required"],
      minlength: [3, "Too short subCategory title"],
      maxlength: [32, "Too long subCategory title"],
    },
    active: {
      type: Boolean,
      default: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title",
  });

  next();
});

subCategorySchema.post("save", async function (doc, next) {
  
  await doc
    .populate({
      path: "category",
      select: "title",
    })
    ; 

  next();
});


const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
