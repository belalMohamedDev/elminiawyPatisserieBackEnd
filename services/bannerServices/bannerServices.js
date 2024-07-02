const bannerModel = require("../../modules/bannerModel");
const factory = require("../handleFactor/handlerFactory");
const { uploadSingleImage } = require("../../middleware/imageUploadMiddleware");
const { resizeImage } = require("../../middleware/resizeImage");
const { uploadToCloudinary } = require("../../middleware/cloudinaryMiddleWare");

//upload single image
exports.uploadBannerImage = uploadSingleImage("image");

// rssize image before upload
exports.resizeBannerImage = resizeImage("banner");

// upload image in cloud
exports.uploadImageInCloud = uploadToCloudinary();

// @ dec delete photo from cloud using when update
exports.deleteImageBeforeUpdate = factory.deletePhotoFromCloud(bannerModel);

//  @dec    create Banner
//  @route  Post  /api/v1/banner
//  @access Private (admin )
exports.createBanner = factory.creatOne(bannerModel, "banner");

//  @dec    get list of banner
//  @route  Get  /api/v1/banner?page=?&limit=?
//  @access Private (admin)
exports.getAllbanner = factory.getAllData(bannerModel, "banner");


//  @dec    update  Banner by id
//  @route  Put  /api/v1/banner/:id
//  @access Private (admin)
exports.UpdateBanner = factory.updateOne(bannerModel, "banner");

//  @dec    delete  Banner by id
//  @route  Delete  /api/v1/banner/:id
//  @access Private (admin)
exports.deleteBanner = factory.deleteOne(bannerModel, "banner");
