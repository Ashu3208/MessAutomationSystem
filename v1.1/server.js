if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const User = require('./models/user.js');
// Importing Libraies that we installed using npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const connection = require("./db");
const cors = require("cors");
connection();


// const usersCollection = db.collection('users');

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {

   
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save(); // save the user data to the database
        console.log(user); // display newly registered user in the console
        res.redirect("/login");
        
    } catch (e) {
        console.log(e);
        res.redirect("/register");
    }

})
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )



// Routes
app.get('/', checkAuthenticated, (req, res) => {
    res.render("home.ejs")
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})
app.get('/Orders', checkAuthenticated, (req, res) => {
    res.render("Orders.ejs")
})
app.get('/Complain', checkAuthenticated, (req, res) => {
    res.render("Complain.ejs")
})
app.get('/Rebate', checkAuthenticated, (req, res) => {
    res.render("Rebate.ejs")
})
app.get('/Mess-bill', checkAuthenticated, (req, res) => {
    res.render("Mess-bill.ejs")
})
app.get('/Mess-Menu', checkAuthenticated, (req, res) => {
    res.render("Mess-Menu.ejs")
})
app.get('/History', checkAuthenticated, (req, res) => {
    res.render("History.ejs")
})
app.get('/Extras', checkAuthenticated, (req, res) => {
    res.render("Extras.ejs")
})


// End Routes



app.delete("/logout",checkAuthenticated, (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/login")
    }
    next()
}

app.listen(3000)