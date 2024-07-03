const multer = require("multer");
const ApiError = require("../utils/apiError/apiError");


  
const multerOption=()=>{
    const multerStorage = multer.memoryStorage();
    //memory storage
  const multerFilter = function (req, file, cb) {
    
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images are allowed", 400), false);
    }
  };
  
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
  return upload
  }
  
  
const uploadSingleImage=(fieldName)=> multerOption().single(fieldName);
  
  
  
  
const uploadListOfImage=(arryOfFields)=> multerOption().fields(arryOfFields);


  module.exports={uploadSingleImage,uploadListOfImage}



