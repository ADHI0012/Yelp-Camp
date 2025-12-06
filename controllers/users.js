const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp !");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo; //
  req.flash("success", "Welcome back to YelpCamp");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully Logged Out !");
    res.redirect("/campgrounds");
  });
};
