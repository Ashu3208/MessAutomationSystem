// require express router, passport
const router = require('express').Router()
const passport = require('passport')
require("dotenv").config();

// User Model
const User = require('../models/User')

//create passport local strategy
passport.use(User.createStrategy())

//Serialise and deserialize user
passport.serializeUser(function(user,done){
    done(null,user.id)
})
passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        done(err, null);
      });
  });
  


// register user in db
router.post("/auth/register", async (req,res) =>{
    try {
        const registerUser = await User.register({name:req.body.name,rollNumber:req.body.rollNumber,username: req.body.username},req.body.password);
        if(registerUser){
            passport.authenticate("local") (req,res,function(){
                res.redirect("/login")
            })
        }else{
            res.redirect("/register")
        }
        } catch (error) {
        res.send(error)
    }
})

// Login User
router.post("/auth/login", (req,res)=>{
    // create new user object
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    // using passport login method we will check if credentials are correct or not
    req.login(user,(err)=>{
        if(err){
            console.log(err)
        }else{
            if(user.username==='admin@iitk.com'&&user.password =='admin123'){
                process.env.SUPERUSER = 'true';
                passport.authenticate("local")(req,res,function(){
                res.redirect("/manager/home")
            })
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/")
                })
            }
        }
        
    })    
})


// Logout user
router.get("/auth/logout",function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  router.post("/auth/logout",function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });


//Getting Order Model
const Order =require('../models/Orders')

//saving orders in db
router.post('/Orders', async(req, res) => {
    try {
        const order=new Order({
            itemName:req.body.itemName,
            quantity:req.body.quantity,
            price:req.body.price
        })
        const newOrder =  order.save();
        if(newOrder){
        res.redirect("/Orders")
        }else{
            res.redirect("/Home")
        }
        } catch (error) {
        res.send(error)
    }
    
  });

//export router
module.exports = router;