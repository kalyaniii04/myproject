const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",

  // REQUIRED to avoid OSM blocking
  userAgent: "myproject/1.0 (contact: your-email@gmail.com)",

  // Optional but helpful
  timeout: 5000,
});

module.exports = geocoder;
