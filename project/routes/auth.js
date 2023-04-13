// require express router, passport
const router = require('express').Router()
const passport = require('passport')

require("dotenv").config();

// User Model
const User = require('../models/User')
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//create passport local strategy
passport.use(User.createStrategy())

//Serialise and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(function (user) {
            done(null, user);
        })
        .catch(function (err) {
            done(err, null);
        });
});


// Verify the email address
axios.get('https://apilayer.net/api/check', {
    params: {
        access_key: process.env.MAILBOXLAYER_API_KEY,
        email,
    },
})
    .then((response) => {
        const { format_valid, smtp_check } = response.data;
        if (format_valid && smtp_check) {
            // The email address is valid and deliverable, so send the OTP email
            const msg = {
                to: email,
                from: 'your-email@example.com',
                subject: 'Your OTP for website registration',
                text: `Your OTP is ${otp}`,
            };

            sgMail.send(msg)
                .then(() => {
                    res.send('OTP sent to your email');
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error sending OTP');
                });
        } else {
            // The email address is invalid or undeliverable, so show an error message
            res.status(400).send('Invalid email address');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error verifying email address');
    });


app.post('/register', (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(Math.random() * 10000);
    
    
  });
  

// register user in db
router.post("/auth/register", async (req, res) => {
    try {
        function isWhitespaceString(str) {
            return /^\s*$/.test(str);
        }
        if (!isWhitespaceString(req.body.name)) {
            if (req.body.rollNumber > 100000 && req.body.rollNumber < 100000000) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@iitk\.ac\.in$/;

                // Example usage:
                const email = req.body.username;

                if (emailRegex.test(email)) {
                    console.log('Valid email');
                    const existingUser = await User.findOne({ username: req.body.username });
                    const existingroll = await User.findOne({ rollNumber: req.body.rollNumber })
                    if (existingUser) {
                        // username already exists, send an alert to the user
                        return res.send(`<script>alert("Sorry, that email address is already in use. Please try logging in or use a different email address to register.
                        "); window.location.href='/register';</script>`);
                    } else if (existingroll) {
                        return res.send(`<script>alert("Roll number already exists. Please choose a different roll number."); window.location.href='/register';</script>`);
                    }
                    else {
                        const registerUser = await User.register({
                            name: req.body.name,
                            rollNumber: req.body.rollNumber,
                            username: req.body.username,
                            extrasCost: 0,
                            rebateDays: 0,
                            dues: 0
                        }, req.body.password);
                        if (registerUser) {
                            res.redirect("/login");
                        } else {
                            res.redirect("/register");
                        }
                    }

                } else {
                    console.log('Invalid email');
                    res.redirect("/register")
                }


            } else {
                console.log("invalid rollno")
                res.redirect("/register")

            }

        } else {
            console.log("empty name")
            res.redirect("/register")

        }

    } catch (error) {
        res.send(error)
    }
})

// Login User
router.post("/auth/login", (req, res) => {
    // create new user object
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    let error = 0;
    // using passport login method we will check if credentials are correct or not
    req.login(user, (err) => {
        if (err) {
            console.log(err)
        } else {
            if (user.username === 'admin@iitk.com' && user.password == 'admin123') {
                process.env.SUPERUSER = 'true';
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/manager/home")
                })
            } else {
                process.env.SUPERUSER = 'false';
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/")
                })
            }
        }

    })
})


// Logout user
router.get("/auth/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});
router.post("/auth/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});


//export router
module.exports = router;
