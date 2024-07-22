const mongoose = require('mongoose')
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

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);



// work in get all data ,get specific data ,update data, delete
subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: 'title image -_id' })
  next()
})


subCategorySchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});


const subCategoryModel = mongoose.model('subCategory', subCategorySchema)

module.exports = subCategoryModel
