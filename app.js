const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const campgroundRoutes = require("./routes/campground.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION SUCCESSFULL");
  })
  .catch(() => {
    console.log("MONGO CONNECTION ERROR");
  });

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use(express.static("public"));

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/fakeUser", async (req, res) => {
  const user = await new User({ email: "adhi@gmail.com", username: "Adhi" });
  const newUser = await User.register(user, "adhi199");
  res.send(newUser);
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
