const Campground = require("../models/campground");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  // console.log(req.body);
  const campground = await Campground.findById(req.params.id);

  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created a new Review !");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "You have successfully deleted the review");
  res.redirect(`/campgrounds/${id}`);
};
