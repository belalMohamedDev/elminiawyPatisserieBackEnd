const jwt = require("jsonwebtoken");

// @ dec this func to create token , use in login and signup
const creatToken = (payload,securityKey,expiredTime) =>
  jwt.sign({ userId: payload }, securityKey, {
    expiresIn: expiredTime,
  });

module.exports = creatToken;



// const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
// const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });

// user.refreshToken = refreshToken;


//process.env.JWT_SECRET_KEY
//process.env.JWT_EXPIER_TIME