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

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.body);
    const campground = await Campground.findById(req.params.id);

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new Review !");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "You have successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
  }
);

module.exports = router;
