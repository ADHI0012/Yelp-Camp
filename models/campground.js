const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_scale,w_200");
});

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [ImageSchema],
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
  },
  opts
);
CampgroundSchema.virtual("properties.popUpHTML").get(function () {
  return `<strong><a href="campgrounds/${this._id}">${this.name}</a></strong>`;
});
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("Campgrounds", CampgroundSchema);
module.exports = Campground;
