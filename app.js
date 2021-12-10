// requiring our dependencies (packages installed using NPM)
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

console.log(process.env.SECRET);

// setting up our dependencies.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

//Schema and model of database.
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });   //encrypts our password, see docs. for more information.
const User = mongoose.model("User", userSchema);

//Interacting with our client-server relationship
app.route("/")
  .get(function(req, res) {
    res.render("home");
  });

app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {

    const email = req.body.userName;
    const password = req.body.password;
    User.findOne({email: email}, function(err, foundUser){
      if(!err){
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }else{
            res.send("Wrong password.")
          }
        }
      }else{
        console.log(err);
      }
    });
  })

app.route("/register")
  .get(function(req, res) {
    res.render("register");
  })
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.userName,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  })

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server has started.")
});
