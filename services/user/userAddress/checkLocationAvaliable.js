const asyncHandler = require("express-async-handler");
const axios = require("axios");
const storeAddressModel = require("../../../modules/storeAddressModel");

// @dec Check if location is available or not based on store's delivery range
// @route POST /api/v1/address/isAvailable
// @access Protected


exports.checkLocationAvailable = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  const apiKey = process.env.GOOGLE_API_KEY;  

  // Prepare the URL for Google Maps API request
  const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;


  const userLocation = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  };


  // Run both the store search and Google Maps API request in parallel
  const [stores, googleApiResponse] = await Promise.all([
    await storeAddressModel.findOne({
      deliveryZone: {
        $geoIntersects: {
          $geometry: userLocation,
        },
      },
    }),
    axios.get(googleApiUrl), // Fetch the address from Google API
  ]);

  // Extract the formatted address from Google API response
  const address = googleApiResponse.data.results[0]?.formatted_address || "Address not found";
  const isAddressAvailable = address !== "Address not found"; // true if address is found, false if not



  // Check if any stores are available within the delivery range
  if (!stores) {
    return res.status(200).json({
      status: true,
      message: "No stores available within the specified distance.",
      address: address,
      StoreAddressAvailable: false,
      isAddressAvailable:isAddressAvailable
    });
  }

  return res.status(200).json({
    status: true,
    message: "Store found within the specified distance.",
    address: address,
    StoreAddressAvailable: true,
    isAddressAvailable:isAddressAvailable

  });
});


// exports.checkLocationAvailable = asyncHandler(async (req, res, next) => {
//   const { latitude, longitude } = req.body;

//   const apiKey = process.env.GOOGLE_API_KEY;  

//   // Prepare the URL for Google Maps API request
//   const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

//   // Run both the store search and Google Maps API request in parallel
//   const [stores, googleApiResponse] = await Promise.all([
//     storeAddressModel.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [parseFloat(longitude), parseFloat(latitude)],
//           },
//           distanceField: "distance",
//           spherical: true,
//           key: "location",
//         },
//       },
//       {
//         $addFields: {
//           deliveryRangeInMeters: { $multiply: ["$deliveryRange", 1000] },
//         },
//       },
//       {
//         $match: {
//           $expr: { $lte: ["$distance", "$deliveryRangeInMeters"] },
//         },
//       },
//       {
//         $project: {
//           distance: {
//             $round: ["$distance", 2],
//           },
//         },
//       },
//     ]),
//     axios.get(googleApiUrl), // Fetch the address from Google API
//   ]);

//   // Extract the formatted address from Google API response
//   const address = googleApiResponse.data.results[0]?.formatted_address || "Address not found";
//   const isAddressAvailable = address !== "Address not found"; // true if address is found, false if not


//   // Check if any stores are available within the delivery range
//   if (!stores.length) {
//     return res.status(200).json({
//       status: true,
//       message: "No stores available within the specified distance.",
//       address: address,
//       StoreAddressAvailable: false,
//       isAddressAvailable:isAddressAvailable
//     });
//   }

//   return res.status(200).json({
//     status: true,
//     message: "Store found within the specified distance.",
//     address: address,
//     StoreAddressAvailable: true,
//     isAddressAvailable:isAddressAvailable

//   });
// });
