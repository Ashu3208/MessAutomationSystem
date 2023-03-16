router = require('express').Router()

// create routes
//get home
router.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("home")
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
        res.redirect('/')
    }
    else{
        res.render("login")
    }
})

module.exports= router