exports.sanitizeUser = function (user,refreshToken) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    refreshToken: refreshToken
  };
};


