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
const multer = require("multer");
const { storage } = require("../cloudinary-config");
const upload = multer({ storage });

router
  .route("/")
  .get(campgrounds.show)

  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    isAuthor,
    wrapAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampground)
);

module.exports = router;
