//jshint esversion:6
require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB")
const UserSchema = mongoose.Schema({
  user: String,
  password: String
})
const secret = "This is secret!"
UserSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']})
const User = mongoose.model("user", UserSchema)

app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/login", function(req, res) {
  let user = req.body.username
  let password = req.body.password
  User.findOne({user: user}, function (e, r) {
    if (e){
      res.send("error!")
    } else {
      if (r.password == password) {
        res.render("secrets")
      } else {
        res.send("wrong!")
      }
    }
  })
})

app.get("/register", function (req, res) {  
  res.render("register")
})

app.post('/register', function(req, res) {
  let newUser = new User ({
    user: req.body.username,
    password: req.body.password
  })
  newUser.save(function(e) {
    if (!e) {
      res.render("secrets")
    }
  })
})

app.listen(3000, function(req, res) {
  console.log("Runserver")
})