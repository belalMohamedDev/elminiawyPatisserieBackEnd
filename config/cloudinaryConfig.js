// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

//connect with cloudinary TO UPLOAD IMAGE
const cloudinaryConfig = () =>
  cloudinary
    .config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    
    })
  

module.exports = cloudinaryConfig;
