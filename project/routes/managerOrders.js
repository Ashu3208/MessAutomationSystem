router = require("express").Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Order = require("../models/Order");

router.get("/manager/order", async (req, res) => {
  if (req.isAuthenticated()) {
    if (process.env.SUPERUSER === "true") {
      res.render("manager/order", {
        orders: await Order.find({}),
        session: req.session,
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/manager/order", async (req, res) => {
  req.session.flag = 1;
  req.session.orderId = req.body.orderId;
  req.session.index = req.body.index;
  console.log(req.body);
  res.redirect("/manager/order");
});

router.post("/code", async (req, res) => {
  const order= await Order.findById(req.session.orderId);

  console.log(parseInt(order.code[req.session.index]));
  console.log(parseInt(req.body.code));
  if(parseInt(req.body.code) === parseInt(order.code[req.session.index]) ){
    req.session.flag = 2;
    await Order.findByIdAndUpdate(req.session.orderId,{ $set: { [`status.${req.session.index}`]: "cleared" } })
  }else{
    req.session.flag = 3;
  }
  console.log(req.body);
  res.redirect("/manager/order");
});

module.exports = router;
