const { deleteImageFromCloudinary } = require("./cloudinaryMiddleWare");
const i18n = require("i18n");
const ApiError = require("../utils/apiError/apiError");

const handleJwtInvalidSignature = () =>
  new ApiError(i18n.__("invalidToken"), 401);

const handleTokenExpiredError = () =>
  new ApiError(i18n.__("tokenExpired"), 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (req.body.publicId) {
    deleteImageFromCloudinary(req.body.publicId);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();

    sendErrorForProd(err, res);
  }
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
  });
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = globalError;
