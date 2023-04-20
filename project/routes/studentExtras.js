router = require("express").Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Extra = require("../models/Extra");
const Order = require("../models/Order");
const User = require("../models/User");

router.get("/extras", async (req, res) => {
    if (req.isAuthenticated()) {
      if (process.env.SUPERUSER === "true") {
        res.redirect("/");
      } else {
        res.render("student/extras", { extrasMenu: await Extra.find({}) });
      }
    } else {
      res.redirect("/login");
    }
  });

router.post("/extras", async (req, res) => {

    const list = await Extra.find({});
    const items = [],
      prices = [],
      quantities = [];
    let totalCost = 0;
    try {
      for (let i = 0; i < req.body.quantity.length; i++) {
        if (req.body.quantity[i] > 0) {
          items.push(list[i].name);
          prices.push(list[i].price);
          quantities.push(req.body.quantity[i]);
          totalCost += req.body.quantity[i] * list[i].price;
        }
      }
    } catch (error) {
      return res.send(`
          <script>
          alert("no extras available at this movement,please try again later.")
          window.location.href='/extras';</script>`);
    }
  
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { extrasCost: totalCost },
    });
    if (items.length != 0) {
      const order = new Order({
        rollNo: req.user.rollNumber,
        itemName: items,
        quantity: quantities,
        price: prices,
        total: totalCost,
      });
      order.save();
      console.log(order);
      res.redirect("/orders");
    } else {
      res.redirect("/extras");
    }
  });

module.exports = router;