router = require('express').Router()
require("dotenv").config();
const Extra = require('../models/Extra')
const Order = require('../models/Order')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Complaint = require('../models/Complaint')
const Bill = require('../models/Bill')
const User = require('../models/User')
const Item = require('../models/Item')
const Rebate = require('../models/Rebate')
// const popup = require('popups');

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
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/order", { orders: await Order.find({ rollNo: req.user.rollNumber }) })
        }

    }
    else {
        res.redirect("/login")
    }
})

// Mess menu page
router.get("/mess-menu", async (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/mess-menu", { mob: await Item.find({ code: "110" }), mobe: await Item.find({ code: "111" }), mol: await Item.find({ code: "120" }), mole: await Item.find({ code: "121" }), mod: await Item.find({ code: "130" }), mode: await Item.find({ code: "131" }), tub: await Item.find({ code: "210" }), tube: await Item.find({ code: "211" }), tul: await Item.find({ code: "220" }), tule: await Item.find({ code: "221" }), tud: await Item.find({ code: "230" }), tude: await Item.find({ code: "231" }), web: await Item.find({ code: "310" }), webe: await Item.find({ code: "311" }), wel: await Item.find({ code: "320" }), wele: await Item.find({ code: "321" }), wed: await Item.find({ code: "330" }), wede: await Item.find({ code: "331" }), thb: await Item.find({ code: "410" }), thbe: await Item.find({ code: "411" }), thl: await Item.find({ code: "420" }), thle: await Item.find({ code: "421" }), thd: await Item.find({ code: "430" }), thde: await Item.find({ code: "431" }), frb: await Item.find({ code: "510" }), frbe: await Item.find({ code: "511" }), frl: await Item.find({ code: "520" }), frle: await Item.find({ code: "521" }), frd: await Item.find({ code: "530" }), frde: await Item.find({ code: "531" }), sab: await Item.find({ code: "610" }), sabe: await Item.find({ code: "611" }), sal: await Item.find({ code: "620" }), sale: await Item.find({ code: "621" }), sad: await Item.find({ code: "630" }), sade: await Item.find({ code: "631" }), sub: await Item.find({ code: "710" }), sube: await Item.find({ code: "711" }), sul: await Item.find({ code: "720" }), sule: await Item.find({ code: "721" }), sud: await Item.find({ code: "730" }), sude: await Item.find({ code: "731" }) })
        }
    }
    else {
        res.redirect("/login")
    }
})

router.get("/mess-bill", async (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/mess-bill", { bills: await Bill.find({ rollNo: req.user.rollNumber }) })
        }

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
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/complain", { complaints: await Complaint.find({ rollNo: req.user.rollNumber }) })
        }

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
    let flag= req.query.flag;
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/rebate", { rebates: await Rebate.find({ rollNo: req.user.rollNumber }), message: "",flag: flag})
        }

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
    const student_prev_rebates=await Rebate.find({ rollNo: req.user.rollNumber });

    let flag=0;
    let prev_date_1,prev_date_2;
    for(let i=0;i<(student_prev_rebates).length;i++){
        prev_date_1 = new Date(student_prev_rebates[i].startDate);
        prev_date_2 = new Date(student_prev_rebates[i].endDate);
        if((date1.getTime() >= prev_date_1.getTime() && date1.getTime() <= prev_date_2.getTime()) || (date2.getTime() >= prev_date_1.getTime() && date2.getTime() <= prev_date_2.getTime())){
            flag=1;
            break;
        }
    }
    if (date2.getTime() >= date1.getTime() && date1.getTime() >= curr_date.getTime() && flag == 0) {
        const diff = Math.abs(date2.getTime() - date1.getTime()) + 1;
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
    
    res.redirect("/rebate?flag=" + flag)
    // res.jsonp({error : flag})
})

router.post("/rebate/remove", async (req, res) => {
    await Rebate.findByIdAndRemove(req.body.button)
    console.log("removed successfully")
    res.redirect("/rebate")
})

router.get("/extras", async (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/")
        } else {
            res.render("student/extras", { extrasMenu: await Extra.find({}) })
        }

    }
    else {
        res.redirect("/login")
    }
})

router.post("/extras", async (req, res) => {

    const list = await Extra.find({});
    const items = [], prices = [], quantities = []
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
        return res.send(`<script>alert("Extras unavailable.Please Try again"); window.location.href='/extras';</script>`);
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
        if (process.env.SUPERUSER === 'true') {
            res.redirect("/manager/order")
        } else {
            res.redirect("/")
        }

    }
    else {
        res.redirect("/login")
    }
})

router.get("/manager/order", async (req, res) => {

    if (req.isAuthenticated()) {

        if (process.env.SUPERUSER === 'true') {
            res.render("manager/order", { orders: await Order.find({}) })
        } else {
            res.redirect("/")
        }
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

        if (process.env.SUPERUSER === 'true') {
            res.render("manager/rebateApproval.ejs", { rebates: await Rebate.find({ status: "pending" }) })
        } else {
            res.redirect("/")
        }
    }
    else {
        res.redirect("/login")
    }
})

router.post("/manager/rebateApproval/approved", async (req, res) => {
    await Rebate.findByIdAndUpdate(req.body.button, { status: "Approved" })
    const rebate = await Rebate.findById(req.body.button)
    try {
        await User.findOneAndUpdate({ rollNumber: rebate.rollNo }, { rebateDays: rebate.days })
    } catch (error) {
        return res.send(`<script>alert("Request has been withdrawn"); window.location.href='/manager/rebateApproval';</script>`);
    }
    
    res.redirect("/manager/rebateApproval")
})
router.post("/manager/rebateApproval/rejected", async (req, res) => {
    await Rebate.findByIdAndUpdate(req.body.button, { status: "Rejected" })
    res.redirect("/manager/rebateApproval")
})
router.get("/manager/complaints", async (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.render("manager/complaints", { complaints: await Complaint.find({ reply: "pending" }) })
        } else {
            res.redirect("/")
        }

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

router.get("/manager/messMenu", async (req, res) => {
    if (req.isAuthenticated()) {
        if (process.env.SUPERUSER === 'true') {
            res.render("manager/messMenu", { mob: await Item.find({ code: "110" }), mobe: await Item.find({ code: "111" }), mol: await Item.find({ code: "120" }), mole: await Item.find({ code: "121" }), mod: await Item.find({ code: "130" }), mode: await Item.find({ code: "131" }), tub: await Item.find({ code: "210" }), tube: await Item.find({ code: "211" }), tul: await Item.find({ code: "220" }), tule: await Item.find({ code: "221" }), tud: await Item.find({ code: "230" }), tude: await Item.find({ code: "231" }), web: await Item.find({ code: "310" }), webe: await Item.find({ code: "311" }), wel: await Item.find({ code: "320" }), wele: await Item.find({ code: "321" }), wed: await Item.find({ code: "330" }), wede: await Item.find({ code: "331" }), thb: await Item.find({ code: "410" }), thbe: await Item.find({ code: "411" }), thl: await Item.find({ code: "420" }), thle: await Item.find({ code: "421" }), thd: await Item.find({ code: "430" }), thde: await Item.find({ code: "431" }), frb: await Item.find({ code: "510" }), frbe: await Item.find({ code: "511" }), frl: await Item.find({ code: "520" }), frle: await Item.find({ code: "521" }), frd: await Item.find({ code: "530" }), frde: await Item.find({ code: "531" }), sab: await Item.find({ code: "610" }), sabe: await Item.find({ code: "611" }), sal: await Item.find({ code: "620" }), sale: await Item.find({ code: "621" }), sad: await Item.find({ code: "630" }), sade: await Item.find({ code: "631" }), sub: await Item.find({ code: "710" }), sube: await Item.find({ code: "711" }), sul: await Item.find({ code: "720" }), sule: await Item.find({ code: "721" }), sud: await Item.find({ code: "730" }), sude: await Item.find({ code: "731" }) })
        } else {
            res.redirect("/")
        }

    }
    else {
        res.redirect("/login")
    }
})

router.post("/manager/messMenu/add", async (req, res) => {
    const item = new Item({
        name: req.body.name.trim().replace(/\s+/g, ' '),
        code: req.body.code
    });

    try {
        function isWhitespaceString(str) {
            return /^\s*$/.test(str);
        }
        if (!isWhitespaceString(req.body.name)) {
            try {
                const Code = parseInt(req.body.code);
                const result = await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code }, { code: Code - 2 })

                if (Code % 10 === 0) {
                    
                    const result2 = await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code + 1 }, { code: Code - 1 })
                    
                    if (result.modifiedCount === 0 && result2.modifiedCount === 0) {
                        await item.save()
                        console.log("no copy in regular and extras")
                    } else {
                        await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code - 1 }, { code: Code + 1 })
                        await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code - 2 }, { code: Code })

                    }
                    if (result.modifiedCount === 1) {
                        console.log("regular copy exists")
                    }
                    if (result2.modifiedCount === 1) {
                        console.log("extra copy exists")
                    }
                } else if (Code % 10 === 1) {
                    const result2 = await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code - 1 }, { code: Code - 3 })
                    if (result.modifiedCount === 0 && result2.modifiedCount === 0) {
                        await item.save()
                        console.log("no copy in regular and extras")
                    } else {
                        await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code - 3 }, { code: Code - 1 })
                        await Item.updateOne({ name: req.body.name.trim().replace(/\s+/g, ' '), code: Code - 2 }, { code: Code })

                    }

                    if (result2.modifiedCount === 1) {
                        console.log("regular copy exists")
                    }
                    if (result.modifiedCount === 1) {
                        console.log("extra copy exists")
                    }
                }

            } catch (err) {
                console.log(err)
            }

        }
    } catch (err) {
        console.log(err)
    }
    res.redirect("/manager/messMenu");
})


router.post("/manager/messMenu/remove", async (req, res) => {

    await Item.findByIdAndRemove(req.body.button)
    res.redirect("/manager/messMenu");
})


router.get("/manager/extras", async (req, res) => {
    if (req.isAuthenticated()) {

        if (process.env.SUPERUSER === 'true') {
            res.render("manager/extras", { extrasMenu: await Extra.find({}) })
        } else {
            res.redirect("/")
        }
    }
    else {
        res.redirect("/login")
    }
})
router.post("/manager/extras/add", async (req, res) => {

    const extra = new Extra({
        name: req.body.newItem.trim().replace(/\s+/g, ' '),
        price: req.body.price
    });
    try {
        function isWhitespaceString(str) {
            return /^\s*$/.test(str);
        }
        if (!isWhitespaceString(req.body.newItem) && !isWhitespaceString(req.body.price)) {

            try {
                const result = await Extra.updateOne({ name: req.body.newItem.trim().replace(/\s+/g, ' ') }, { price: req.body.price })
                console.log(result.nModified)

                if (result.modifiedCount === 0) {
                    await extra.save()
                }
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }

    res.redirect("/manager/extras");
})
router.post("/manager/extras/remove", async (req, res) => {

    await Extra.findByIdAndRemove(req.body.button)
    res.redirect("/manager/extras");
})
router.get("/manager/accessAccount", (req, res) => {
    if (req.isAuthenticated()) {

        if (process.env.SUPERUSER === 'true') {
            res.render("manager/accessAccount")
        } else {
            res.redirect("/")
        }
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
        const workingDays = Math.ceil((Math.abs(date2 - date1)) / (1000 * 3600 * 24)) + 1;
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
