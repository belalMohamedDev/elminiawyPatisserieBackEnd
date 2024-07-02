
// @ desc this class is responsible about operation error (that errors that i can predict)

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    //predict
    this.isOperational=true
    
  }
}



module.exports =ApiError