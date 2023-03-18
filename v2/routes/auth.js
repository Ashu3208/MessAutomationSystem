// require express router, passport
const router = require('express').Router()
const passport = require('passport')


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
        const registerUser = await User.register({username: req.body.username},req.body.password);
        if(registerUser){
            passport.authenticate("local") (req,res,function(){
                res.redirect("/home")
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
            passport.authenticate("local")(req,res,function(){
                res.redirect("/")
            })
        }
        
    })    
})


// Logout user
router.get("/auth/logout",(req,res)=>{
    //use passport logout method
    req.logout()
    res.redirect("/login")
})

//export router
module.exports = router;
