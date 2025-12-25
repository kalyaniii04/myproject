const Listing = require("../models/listing.js");
const NodeGeocoder = require("node-geocoder");

/* =========================
   GEOCODER CONFIGURATION
   ========================= */
const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  userAgent: "WanderLustApp/1.0 (kalya@example.com)",
  timeout: 5000,
});

/* =========================
   INDEX – SHOW ALL LISTINGS
   ========================= */
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index", { allListings });
};

/* =========================
   FILTER BY CATEGORY
   ========================= */
module.exports.filter = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  return res.render("filter/showfilter", { allListings, category });
};

/* =========================
   NEW LISTING FORM
   ========================= */
module.exports.createNewListing = (req, res) => {
  return res.render("listings/new");
};

/* =========================
   CREATE LISTING
   ========================= */
module.exports.addNewListing = async (req, res) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in.");
      return res.redirect("/login");
    }

    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    if (req.body.Listing.location) {
      const geoData = await geocoder.geocode(req.body.Listing.location);
      newListing.geometry = geoData.length
        ? {
            type: "Point",
            coordinates: [geoData[0].longitude, geoData[0].latitude],
          }
        : {
            type: "Point",
            coordinates: [0, 0],
          };
    }

    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    return res.redirect("/listings");

  } catch (err) {
    console.error("Add Listing Error:", err);
    req.flash("error", "Could not create listing.");
    return res.redirect("/listings/new");
  }
};

/* =========================
   EDIT FORM
   ========================= */
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);

  if (!list) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const originalImageUrl = list.image.url.replace(
    "/upload",
    "/upload/ar_1:1,c_auto,g_auto,w_500"
  );

  return res.render("listings/edit", { list, originalImageUrl });
};

/* =========================
   SHOW LISTING
   ========================= */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  return res.render("listings/show", {
    listOfID: listing,
    mapToken: process.env.MAP_API_KEY,
    listings: JSON.stringify(listing),
  });
};

/* =========================
   UPDATE LISTING
   ========================= */
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.Listing },
      { new: true, runValidators: true }
    );

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    if (req.body.Listing.location) {
      const geoData = await geocoder.geocode(req.body.Listing.location);
      if (geoData.length) {
        listing.geometry = {
          type: "Point",
          coordinates: [geoData[0].longitude, geoData[0].latitude],
        };
      }
    }

    await listing.save();
    req.flash("success", "Listing Updated Successfully!");
    return res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error("Update Error:", err);
    req.flash("error", "Failed to update listing.");
    return res.redirect(`/listings/${req.params.id}/edit`);
  }
};

/* =========================
   DELETE LISTING
   ========================= */
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  return res.redirect("/listings");
};
