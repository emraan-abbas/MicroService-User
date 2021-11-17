const User = require("../models/user-model"); // Require User Model
const config = require('../controllers/config.json'); // Refresh Token Config

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register ( Create User Here)
const register = (req, res) => {

  // JWT Token Working Here
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  // const token = jwt.sign(
  //   { email, firstName, lastName, password },
  // config.ACCESS_TOKEN_SECRET,
  //   { expiresIn: config.JWT_ACCOUNT_ACTIVATE_EXPIRE_TIMEE }
  // );


  // NODE MAILER WORKS HERE
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrbuilder0@gmail.com",
      pass: "Pakistan1947",
    },
  });

  var mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Your Account Activation Link !",
    html: `
            <h2> Click on given link to activate your account </h2>
            <p> <a href="  ${process.env.URL} /authentication/activate/?token=${token}"> <h2> Click Here !</h2> </a> </p> `,
  };

  // BCRYPT Works Here !
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      return res.json({ error: err });
    }
    console.log(req.body);
    let user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPass,
    });

    // user.createUser("Monkey")

    user
      .save() // Saving User to DB
      .then((userAdded) => {
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email Sent:" + info.response);
          }
        });

        return res.json({
          message: "User Added !",
        });
      })

      .catch((error) => {
        if (error.code === 11000) {
          return res.json(
            {
              message: "User Already Exist",
            },
            400
          );
        } else {
          return res.json(
            {
              message: error.message,
            },
            400
          );
        }
      });
  }); // BCRYPT Code Block
};

// Login ( Login User Here )
const login = (req, res) => {
  
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.status(400);
          return res.json({ error: err });
        }
        if (result) {
          let token = jwt.sign(
            { email: user.email },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
          );
          
          const refreshToken = jwt.sign({ email: user.email }, 'some-secret-refresh-token', { expiresIn: 10000 });
          const response = {
            "status": "Logged in",
            "token": token,
            "refreshToken": refreshToken,
            message: "Login Successful"
        }
          // Refresh Token
          
          res.status(200).json(response);

        } else {
          res.status(400);
          return res.json({
            message: "Incorrect Password !",
          });
        }
      });
    } else {
      res.status(404);
      return res.json({
        message: "No User Found !",
      });
    }
  });
};

module.exports = { register, login };
