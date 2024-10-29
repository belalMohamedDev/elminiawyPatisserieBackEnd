const multer = require("multer");
const ApiError = require("../utils/apiError/apiError");
const path = require("node:path"); 

const multerOption = () => {
  const multerStorage = multer.memoryStorage();
  //memory storage
  const multerFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname);

    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      cb(new ApiError("only images are allowed", 400), false);
    } else {
      cb(null, true);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

const uploadSingleImage = (fieldName) => multerOption().single(fieldName);

const uploadListOfImage = (arryOfFields) => multerOption().fields(arryOfFields);

module.exports = { uploadSingleImage, uploadListOfImage };
