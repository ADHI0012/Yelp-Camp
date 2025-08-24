const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schemas.js");
const Campground = require("../models/campground.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError");

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.body);
    const campground = await Campground.findById(req.params.id);

    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new Review !");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);
router.delete("/:reviewId", async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "You have successfully deleted the review");
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
