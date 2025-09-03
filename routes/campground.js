const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js");

function validateCampground(req, res, next) {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground", 400);

    const newCampground = await new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "You have Successfully create a new Campground !");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const reqCampground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!reqCampground) {
      req.flash("error", "Cannot find requested Campground :(");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground: reqCampground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find requested Campground :(");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "You have updated the Campground !");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "You have successfully deleted the Campground !");

    res.redirect("/campgrounds");
  })
);

module.exports = router;
