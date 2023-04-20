router = require("express").Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Order = require("../models/Order");

router.get("/manager/order", async (req, res) => {
  if (req.isAuthenticated()) {
    if (process.env.SUPERUSER === "true") {
      res.render("manager/order", { orders: await Order.find({}) });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/manager/order", async (req, res) => {
  await Order.findByIdAndDelete(req.body.button);
  console.log(req.body.button);
  res.redirect("/manager/order");
});

module.exports = router;
