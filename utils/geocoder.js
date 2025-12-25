const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  httpAdapter: "fetch",
  formatter: null,
  fetch: {
    headers: {
      "User-Agent": "WanderLust-App/1.0 (contact: your-real-email@example.com)"
    }
  }
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
