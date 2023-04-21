// require express router, passport
const router = require("express").Router();
const passport = require("passport");
const Otp = require("../models/Otp");
require("dotenv").config();

// User Model
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//create passport local strategy
passport.use(User.createStrategy());

//Serialise and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
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
          console.log("Valid email");
          const existingUser = await User.findOne({
            username: req.body.username,
          });
          const existingroll = await User.findOne({
            rollNumber: req.body.rollNumber,
          });
          if (existingUser) {
            // username already exists, send an alert to the user
            return res.redirect("/register?flag=4")
          } else if (existingroll) {
            return res.redirect("/register?flag=5")
          } else {
            const otpValue = Math.floor(Math.random() * 1000000);
            try {
              const otp = new Otp({
                otpSent: otpValue,
                email: email,
                rollNumber: req.body.rollNumber,
                name: req.body.name,
                password: req.body.password,
              });
              await otp.save();
            } catch (err) {
              console.log(err);
            }
            const msg = {
              to: email,
              from: "messautomation7@gmail.com",
              subject: "Your OTP for website registration",
              text: `Your OTP for website registration is ${otpValue}. This OTP is valid for 2 minutes. Please do not share this OTP with anyone for security reasons. Thank you for using IITK Mess Automation!`,
            };

            let flag = 0;
            try {
              await sgMail.send(msg);
              console.log("Email sent");
              flag = 1;
              console.log(flag);
            } catch (error) {
              console.error(error);
            }

            res.redirect("/register?flag=" + flag + "&email=" + email);
          }
        } else {
          console.log("Invalid email");
          res.redirect("/register");
        }
      } else {
        console.log("invalid rollno");
        res.redirect("/register");
      }
    } else {
      console.log("empty name");
      res.redirect("/register");
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/otp", async (req, res) => {
  const otp = await Otp.findOne({
    email: req.body.email,
  });

  if (!otp) {
    res.redirect("/register?flag=2&email=" + req.body.email);
  } else if (parseInt(req.body.otp) === parseInt(otp.otpSent)) {
    const registerUser = await User.register(
      {
        name: otp.name,
        rollNumber: otp.rollNumber,
        username: otp.email,
        extrasCost: 0,
        startingDate: "NA",
        endingDate: "NA",
        rebateStatus: "NA",
        dues: 0,
      },
      otp.password
    );

    if (registerUser) {
      res.redirect("/login?flag=1");
    } else {
      res.redirect("/register");
    }
  } else {
    res.redirect("/register?flag=3&email=" + req.body.email);
  }
});

// Login User
router.post("/auth/login", (req, res) => {
  // create new user object
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  let error = 0;
  // using passport login method we will check if credentials are correct or not
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (
        user.username === "Admin@iitk.ac.in" &&
        user.password == "Admin@123"
      ) {
        process.env.SUPERUSER = "true";
        passport.authenticate("local")(req, res, function () {
          res.redirect("/manager/home");
        });
      } else {
        process.env.SUPERUSER = "false";
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  });
});

// Logout user
router.get("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
router.post("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//export router
module.exports = router;
