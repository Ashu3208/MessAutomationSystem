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
            return res.send(
              `<script>alert("Sorry, that email address is already in use. Please try logging in or use a different email address to register."); window.location.href='/register';</script>`
            );
          } else if (existingroll) {
            return res.send(
              `<script>alert("Roll number already exists. Please choose a different roll number."); window.location.href='/register';</script>`
            );
          } else {
            const otpValue = Math.floor(Math.random() * 1000000);
            try {
              const otp = new Otp({
                otpSent: otpValue,
                email: email,
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

            sgMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
              });
            res.redirect(
              `/otp?email=${encodeURIComponent(
                email
              )}&name=${encodeURIComponent(
                req.body.name
              )}&rollNumber=${encodeURIComponent(
                req.body.rollNumber
              )}&password=${btoa(req.body.password)}`
            );
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

router.get("/otp", (req, res) => {
  // Render the OTP page with the email
  res.render("otp", {
    email: req.query.email,
    rollNumber: req.query.rollNumber,
    password: atob(req.query.password),
    name: req.query.name,
  });
});

router.post("/otp", async (req, res) => {
  const otp = await Otp.findOne({
    email: req.body.email,
  });

  if (!otp) {
    return res.send(`<script>alert("Sorry, your OTP has expired. It appears that you have not completed the registration process yet. Please register again to receive a new OTP and complete your registration.");
    window.location.href = "/register";</script>`);
  } else if (parseInt(req.body.otp) === parseInt(otp.otpSent)) {
    const registerUser = await User.register(
      {
        name: req.body.name,
        rollNumber: req.body.rollNumber,
        username: req.body.email,
        extrasCost: 0,
        rebateDays: 0,
        dues: 0,
      },
      req.body.password
    );

    if (registerUser) {
      return res.send(`<script>alert("OTP verification successful! You may now proceed to login.");
      window.location.href = "/login";</script>`);
    } else {
      res.redirect("/register");
    }
  } else {
    return res.send(`<script>alert("Sorry, the OTP you entered is incorrect. Please try again.");
    window.location.href = "/otp?email=${encodeURIComponent(
      req.body.email
    )}&name=${encodeURIComponent(
      req.body.name
    )}&rollNumber=${encodeURIComponent(req.body.rollNumber)}&password=${btoa(
      req.body.password
    )}";
    </script>`);
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
      if (user.username === "admin@iitk.com" && user.password == "admin123") {
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