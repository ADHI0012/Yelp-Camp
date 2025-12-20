const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary-config");

module.exports.createCampground = async (req, res) => {
  // if (!req.body.campground) throw new ExpressError("Invalid Campground", 400);
  const newCampground = await new Campground(req.body.campground);
  newCampground.author = req.user._id;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newCampground.save();

  req.flash("success", "You have Successfully create a new Campground !");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCampground = async (req, res) => {
  const reqCampground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!reqCampground) {
    req.flash("error", "Cannot find requested Campground :(");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground: reqCampground });
};

module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find requested Campground :(");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "You have successfully deleted the Campground !");

  res.redirect("/campgrounds");
};

module.exports.show = async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
};
