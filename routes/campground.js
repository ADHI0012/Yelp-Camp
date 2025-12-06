const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const campgrounds = require("../controllers/campgrounds.js");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

router
  .route("/")
  .get(campgrounds.show)
  .post(
    isLoggedIn,
    validateCampground,
    wrapAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(validateCampground, isAuthor, wrapAsync(campgrounds.updateCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampground)
);

router.delete("/:id", isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;
