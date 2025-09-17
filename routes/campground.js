const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

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
    newCampground.author = req.user._id;
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
    const reqCampground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(reqCampground);
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
  isAuthor,
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
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "You have updated the Campground !");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "You have successfully deleted the Campground !");

    res.redirect("/campgrounds");
  })
);

module.exports = router;
