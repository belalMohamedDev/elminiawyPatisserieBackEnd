const asyncHandler = require("express-async-handler");
const axios = require("axios");
const storeAddressModel = require("../../../modules/storeAddressModel");
const i18n = require("i18n");

// @dec Check if location is available or not based on store's delivery range
// @route POST /api/v1/address/isAvailable
// @access public

exports.checkLocationAvailable = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  const apiKey = process.env.GOOGLE_API_KEY;

  // Prepare the URL for Google Maps API request for both languages
  const googleApiUrlEn = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`;
  const googleApiUrlAr = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=ar`;

  const userLocation = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  };

  // Run both the store search and Google Maps API requests in parallel
  const [stores, googleApiResponseEn, googleApiResponseAr] = await Promise.all([
    storeAddressModel.findOne({
      deliveryZone: {
        $geoIntersects: {
          $geometry: userLocation,
        },
      },
    }),
    axios.get(googleApiUrlEn), // Fetch the address in English from Google API
    axios.get(googleApiUrlAr), // Fetch the address in Arabic from Google API
  ]);

  // Extract the formatted addresses from Google API responses
  const addressEn =
    googleApiResponseEn.data.results[0]?.formatted_address ||
    i18n.__("addressNotFound");
  const addressAr =
    googleApiResponseAr.data.results[0]?.formatted_address ||
    i18n.__("addressNotFound");

  const isAddressAvailable =
    addressEn !== i18n.__("addressNotFound") &&
    addressAr !== i18n.__("addressNotFound");

  // Check if any stores are available within the delivery range
  if (!stores) {
    return res.status(200).json({
      status: true,
      message: i18n.__("noStoresAvailableWithinTheSpecifiedDistance"),
      englishAddress: addressEn,
      arabicAddress: addressAr,  
      StoreAddressAvailable: false,
      isAddressAvailable: isAddressAvailable,
    });
  }

  return res.status(200).json({
    status: true,
    message: i18n.__("storeFoundWithinTheSpecifiedDistance"),
    englishAddress: addressEn,
    arabicAddress: addressAr,  
    StoreAddressAvailable: true,
    isAddressAvailable: isAddressAvailable,
  });
});
