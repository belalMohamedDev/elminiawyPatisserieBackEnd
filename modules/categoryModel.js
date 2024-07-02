const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: [true, 'Category must be uniqe'],
      required: [true, 'Category is required'],
      minlength: [3, 'Too short category title'],
      maxlength: [300, 'Too long category title'],
    },
    image: String,
    publicId: String,
  },
  { timestamps: true },
)

const categoryModel = mongoose.model('Category', categorySchema)

module.exports = categoryModel
