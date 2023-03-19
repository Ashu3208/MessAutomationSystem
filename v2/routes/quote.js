router = require('express').Router()
require("dotenv").config();
// create routes
//get home
router.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        if(process.env.SUPERUSER==='true')res.redirect("/managerHome")
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















// All manager get and post requests
router.get("/managerHome",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("managerHome")
    }
    else{
        res.redirect("/login")
    }
})




module.exports= router
