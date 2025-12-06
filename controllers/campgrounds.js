const Campground = require("../models/campground");

module.exports.createCampground = async (req, res) => {
  // if (!req.body.campground) throw new ExpressError("Invalid Campground", 400);
  const newCampground = await new Campground(req.body.campground);
  newCampground.author = req.user._id;
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
  console.log(reqCampground);
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
  await Campground.findByIdAndUpdate(id, req.body.campground);
  req.flash("success", "You have updated the Campground !");
  res.redirect(`/campgrounds/${id}`);
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
