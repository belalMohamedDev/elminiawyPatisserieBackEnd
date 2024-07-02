exports.sanitizeUser = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    refreshToken: user.refreshToken,
  };
};
