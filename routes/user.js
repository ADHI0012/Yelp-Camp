const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router.route("/register").get(users.renderRegister).post(users.signup);
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
