router = require('express').Router()
require("dotenv").config();
const Extra = require('../models/Extra')
const Order = require('../models/Order')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Complaint = require('../models/Complaint')
const Bill = require('../models/Bill')
const User = require('../models/User')
const Rebate = require('../models/Rebate')

// create routes
//get home
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') res.redirect("/manager/home")
        else res.render("student/home", { student: req.user })
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
router.get("/orders", async (req, res) => {

    if (req.isAuthenticated()) {
        res.render("student/order", { orders: await Order.find({ rollNo: req.user.rollNumber }) })
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

router.get("/mess-bill", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/mess-bill", { bills: await Bill.find({ rollNo: req.user.rollNumber }) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/mess-bill", async (req, res) => {

    await Bill.findByIdAndRemove(req.body.button)
    console.log("removed successfully")
    res.redirect("/mess-bill")
})

router.get("/complain", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/complain", { complaints: await Complaint.find({ rollNo: req.user.rollNumber }) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/complain", async (req, res) => {

    const complaint = new Complaint({
        rollNo: req.user.rollNumber,
        issue: req.body.text,
        reply: "pending"
    });
    console.log(req.body);
    complaint.save()
    res.redirect("/complain")

})

router.post("/complain/remove", async (req, res) => {

    await Complaint.findByIdAndRemove(req.body.button)
    console.log("removed successfully")
    res.redirect("/complain")


})

router.get("/rebate", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/rebate", { rebates: await Rebate.find({ rollNo: req.user.rollNumber }) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/rebate", async (req, res) => {
    const rebate = new Rebate({
        rollNo: req.user.rollNumber,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        days: req.body.daysNumber,
        status: "pending"
    })
    rebate.save()
    res.redirect("/rebate")
})

router.post("/rebate/remove", async (req, res) => {
    await Rebate.findByIdAndRemove(req.body.button)
    console.log("removed successfully")
    res.redirect("/rebate")
})

router.get("/extras", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/extras", { extrasMenu: await Extra.find({}) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/extras", async (req, res) => {

    const list = await Extra.find({});
    const items = [], prices = [], quantities = []
    let totalCost = 0;

    for (let i = 0; i < req.body.quantity.length; i++) {
        if (req.body.quantity[i] > 0) {
            items.push(list[i].name);
            prices.push(list[i].price);
            quantities.push(req.body.quantity[i]);
            totalCost += req.body.quantity[i] * list[i].price;
        }
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { extrasCost: totalCost } })
    const order = new Order({
        rollNo: req.user.rollNumber,
        itemName: items,
        quantity: quantities,
        price: prices,
        total: totalCost
    })
    order.save()
    console.log(order)
    res.redirect("/orders")
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

router.get("/manager/order", async (req, res) => {

    if (req.isAuthenticated()) {
        res.render("manager/order", { orders: await Order.find({}) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/manager/order", async (req, res) => {
    await Order.findByIdAndDelete(req.body.button)
    console.log(req.body.button)
    res.redirect("/manager/order");
})


router.get("/manager/rebateApproval", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/rebateApproval.ejs", { rebates: await Rebate.find({ status: "pending" }) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/manager/rebateApproval/approved", async (req, res) => {
    await Rebate.findByIdAndUpdate(req.body.button, { status: "Approved" })
    const rebate = await Rebate.findById(req.body.button)
    await User.findOneAndUpdate({ rollNumber: rebate.rollNo }, { rebateDays: rebate.days })
    res.redirect("/manager/rebateApproval")
})
router.post("/manager/rebateApproval/rejected", async (req, res) => {
    await Rebate.findByIdAndUpdate(req.body.button, { status: "Rejected" })
    res.redirect("/manager/rebateApproval")
})
router.get("/manager/complaints", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("manager/complaints", { complaints: await Complaint.find({ reply: "pending" }) })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/manager/complaints", async (req, res) => {

    await Complaint.findByIdAndUpdate(req.body.button, { reply: req.body.reply })
    res.redirect("/manager/complaints")
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
        res.render("manager/extras", { extrasMenu: await Extra.find({}) })
    }
    else {
        res.redirect("/login")
    }
})
router.post("/manager/extras/add", async (req, res) => {

    const extra = new Extra({
        name: req.body.newItem,
        price: req.body.price
    });
    extra.save();
    res.redirect("/manager/extras");
})
router.post("/manager/extras/remove", async (req, res) => {

    await Extra.findOneAndDelete({ name: req.body.button })
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

router.post("/manager/accessAccount", async (req, res) => {

    const students = await User.find({})

    for (let i = 0; i < students.length; i++) {
        let totalCost = 0;
        totalCost = (req.body.workingDays - students[i].rebateDays) * req.body.dailyCost + students[i].extrasCost;
        const bill = new Bill({
            rollNo: students[i].rollNumber,
            month: req.body.month,
            year: req.body.year,
            workingDays: req.body.workingDays,
            dailyCost: req.body.dailyCost,
            rebateDays: students[i].rebateDays,
            extrasCost: students[i].extrasCost,
            total: totalCost
        })
        bill.save()
        await User.findOneAndUpdate({ rollNumber: bill.rollNo }, { extrasCost: 0, rebateDays: 0, $inc: { dues: totalCost } })
    }
    res.redirect("/manager/accessAccount")
})

router.post("/manager/accessAccount/update", async (req, res) => {
    await User.updateOne({ rollNumber: req.body.rollNo }, { $inc: { dues: - req.body.paid } })
    res.redirect("/manager/accessAccount")
})

module.exports = router