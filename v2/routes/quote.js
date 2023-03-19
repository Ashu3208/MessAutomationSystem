router = require('express').Router()
require("dotenv").config();


// create routes
//get home
router.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        if(process.env.SUPERUSER==='true')res.redirect("/manager/home")
        else res.render("home")
    }
    else{
        res.redirect("/login")
    }
})

//get register page
router.get("/register",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/login')
    }
    else{
        res.render("register")
    }
})

//login page
router.get("/login",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        res.render("login")
    }
})

// Orders page
router.get("/orders",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("order")
    }
    else{
        res.redirect("/login")
    }
})

// Mess menu page
router.get("/mess-menu",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("mess-menu")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/mess-bill",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("mess-bill")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/complain",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("complain")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/rebate",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("rebate")
    }
    else{
        res.redirect("/login")
    }
})





// All manager get and post requests
router.get("/manager/home",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/home")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/manager/order",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/order")
    }
    else{
        res.redirect("/login")
    }
})
router.get("/manager/rebateApproval",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/rebateApproval.ejs")
    }
    else{
        res.redirect("/login")
    }
})
router.get("/manager/complaints",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/complaints")
    }
    else{
        res.redirect("/login")
    }
})
router.get("/manager/messMenu",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/messMenu")
    }
    else{
        res.redirect("/login")
    }
})
router.get("/manager/extras",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/extras")
    }
    else{
        res.redirect("/login")
    }
})
router.get("/manager/accessAccount",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("manager/accessAccount")
    }
    else{
        res.redirect("/login")
    }
})


module.exports= router