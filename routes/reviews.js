const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviews = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
