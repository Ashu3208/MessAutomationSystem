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
    function isWhitespaceString(str) {
        return /^\s*$/.test(str);
    }
    if (!isWhitespaceString(req.body.text)) {
        await complaint.save()
    }

    res.redirect("/complain")

})

router.post("/complain/remove", async (req, res) => {

    await Complaint.findByIdAndRemove(req.body.button)
    console.log("removed successfully")
    res.redirect("/complain")


})

router.get("/rebate", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("student/rebate", { rebates: await Rebate.find({ rollNo: req.user.rollNumber }), message: "" })
    }
    else {
        res.redirect("/login")
    }
})

router.post("/rebate", async (req, res) => {

    const start_date = req.body.startDate;
    const end_date = req.body.endDate;

    const date1 = new Date(start_date);
    const date2 = new Date(end_date);
    const curr_date = new Date();
    const startDate = date1.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const endDate = date2.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    if (date2.getTime() >= date1.getTime() && date1.getTime() >= curr_date.getTime()) {
        const diff = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        console.log(diffDays);
        const rebate = new Rebate({
            rollNo: req.user.rollNumber,
            startDate: startDate,
            endDate: endDate,
            days: diffDays,
            status: "pending"
        })
        rebate.save()
    }
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
    if (items.length != 0) {
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

    } else {
        res.redirect("/extras")
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

    function isWhitespaceString(str) {
        return /^\s*$/.test(str);
    }
    if (!isWhitespaceString(req.body.reply)) {
        await Complaint.findByIdAndUpdate(req.body.button, { reply: req.body.reply })
    }

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
    try {
        function isWhitespaceString(str) {
            return /^\s*$/.test(str);
        }
        if (!isWhitespaceString(req.body.newItem) && !isWhitespaceString(req.body.price)) {
            await extra.save();
        }
    } catch (err) {
        console.log(err)
    }

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
    const start = req.body.startDate;
    const end = req.body.endDate;
    let date_obj = new Date(start);
    let formattedStart = date_obj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    date_obj = new Date(end);
    let formattedEnd = date_obj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const date1 = (new Date(start)).getTime();
    const date2 = (new Date(end)).getTime();
    console.log(formattedStart + formattedEnd);

    if (date2 >= date1) {
        const workingDays = Math.ceil((Math.abs(date2 - date1)) / (1000 * 3600 * 24));
        console.log(workingDays);
        for (let i = 0; i < students.length; i++) {
            let totalCost = 0;

            if (workingDays >= students[i].rebateDays) {
                totalCost = (workingDays - students[i].rebateDays) * req.body.dailyCost + students[i].extrasCost;
            } else {
                totalCost = students[i].extrasCost;
            }

            const bill = new Bill({
                rollNo: students[i].rollNumber,
                startDate: formattedStart,
                endDate: formattedEnd,
                workingDays: workingDays,
                dailyCost: req.body.dailyCost,
                rebateDays: students[i].rebateDays,
                extrasCost: students[i].extrasCost,
                total: totalCost
            })
            bill.save()
            await User.findOneAndUpdate({ rollNumber: bill.rollNo }, { extrasCost: 0, rebateDays: 0, $inc: { dues: totalCost } })
        }
    }
    res.redirect("/manager/accessAccount")
})

router.post("/manager/accessAccount/update", async (req, res) => {
    
    if (req.body.paid > 0) {
        await User.updateOne({ rollNumber: req.body.rollNo }, { $inc: { dues: - req.body.paid } })
        await User.updateMany({ dues: { $lt: 0 } }, { dues: 0 })
    }
    res.redirect("/manager/accessAccount")
})

module.exports = router