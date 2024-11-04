exports.sanitizeUser = function (user, refreshToken) {
  // Check if 'user' is an array
  if (Array.isArray(user)) {
    return user.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      image: u.image,
      refreshToken: refreshToken,
      role: u.role,
      deliveryActive: u.deliveryActive,
      completeData: u.completeData,
      storeAddress: u.storeAddress,
    }));
  }

  // If 'user' is a single object
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    refreshToken: refreshToken,
    role: user.role,
    deliveryActive: user.deliveryActive,
    completeData: user.completeData,
    storeAddress: user.storeAddress,
  };
};
