const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const CampgroundSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("Campgrounds", CampgroundSchema);
module.exports = Campground;
