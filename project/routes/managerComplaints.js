router = require("express").Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

router.get("/manager/complaints", async (req, res) => {
  if (req.isAuthenticated()) {
    if (process.env.SUPERUSER === "true") {
      res.render("manager/complaints", {
        complaints: await Complaint.find({ reply: "pending" }),
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/manager/complaints", async (req, res) => {
  function isWhitespaceString(str) {
    return /^\s*$/.test(str);
  }
  if (!isWhitespaceString(req.body.reply)) {
    await Complaint.findByIdAndUpdate(req.body.button, {
      reply: req.body.reply,
    });
  }

  res.redirect("/manager/complaints");
});

module.exports = router;
