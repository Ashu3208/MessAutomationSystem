router = require("express").Router();
require("dotenv").config();

router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.render("register");
  }
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

module.exports = router;