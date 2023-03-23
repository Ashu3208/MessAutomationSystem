router = require('express').Router()
require("dotenv").config();
const Extra = require('../models/Extra')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

// create routes
//get home
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') res.redirect("/manager/home")
        else res.render("student/home")
    }
    else {
        res.redirect("/login")
    }
})

//get register page
router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/login')
    }
    else {
        res.render("register")
    }
})

//login page
router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/")
    }
    else {
        res.render("login")
    }
})

// Orders page
router.get("/orders", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/order")
    }
    else {
        res.redirect("/login")
    }
})

// Mess menu page
router.get("/mess-menu", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/mess-menu")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/mess-bill", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/mess-bill")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/complain", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/complain")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/rebate", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/rebate")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/extras", async (req, res) => {
    if (req.isAuthenticated()) {

        const list = await Extra.find({});
        res.render("student/extras", { extrasMenu: list })

    }
    else {
        res.redirect("/login")
    }
})



// All manager get and post requests
router.get("/manager/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/home")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/manager/order", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/order")
    }
    else {
        res.redirect("/login")
    }
})
router.get("/manager/rebateApproval", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/rebateApproval.ejs")
    }
    else {
        res.redirect("/login")
    }
})
router.get("/manager/complaints", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/complaints")
    }
    else {
        res.redirect("/login")
    }
})
router.get("/manager/messMenu", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/messMenu")
    }
    else {
        res.redirect("/login")
    }
})
router.get("/manager/extras", async (req, res) => {
    if (req.isAuthenticated()) {

        const list = await Extra.find({});
        res.render("manager/extras", { extrasMenu: list })

    }
    else {
        res.redirect("/login")
    }
})
router.post("/manager/extras/add", async (req, res) =>{

    const extra = new Extra({
        name: req.body.newItem
    });

    extra.save();
    res.redirect("/manager/extras");
})
router.post("/manager/extras/remove", async (req, res) => {
    
    await Extra.findOneAndDelete({name:req.body.button})
    res.redirect("/manager/extras");
})
router.get("/manager/accessAccount", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/accessAccount")
    }
    else {
        res.redirect("/login")
    }
})


module.exports = router