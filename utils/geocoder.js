const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  httpAdapter: "fetch",
  formatter: null,
  fetch: {
    headers: {
      "User-Agent": "WanderLust_App (kalyanibj1@gmail.com)"
    }
  }
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
