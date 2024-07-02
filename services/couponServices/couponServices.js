const CouponModel = require("../../modules/couponModel");
const factory = require("../handleFactor/handlerFactory");

//  @dec    create Coupon
//  @route  Post  /api/v1/Coupons
//  @access Private (admin ,storeOwner)
exports.createCoupon = factory.creatOne(CouponModel, "coupons");

//  @dec    get list of Coupons
//  @route  Get  /api/v1/Coupons?page=?&limit=?
//  @access Private (admin,storeOwner)
exports.getAllCoupons = factory.getAllData(CouponModel, "coupons");

//  @dec    get specific Coupon by id
//  @route  Get  /api/v1/Coupons/:id
//  @access Private (admin,storeOwner)
exports.getCoupons = factory.getOne(CouponModel, "coupons");

//  @dec    update  Coupon by id
//  @route  Put  /api/v1/Coupons/:id
//  @access Private (admin,storeOwner)
exports.UpdateCoupon = factory.updateOne(CouponModel, "coupons");

//  @dec    delete  Coupon by id
//  @route  Delete  /api/v1/Coupons/:id
//  @access Private (admin,storeOwner)
exports.deleteCoupon = factory.deleteOne(CouponModel, "coupons");
