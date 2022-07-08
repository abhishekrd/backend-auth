const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/usermodel")
const jwt = require("jsonwebtoken");
const authorize = require("./auth");

dotenv.config();

const port = process.env.PORT || 3000;
const DB = process.env.DB_URL;

app.use(express.json())

app.get("/",(req,res) => {
    res.send("Welcome to Home Screen!")
})

    mongoose.connect(DB,{useNewUrlParser: true,useUnifiedTopology:true})
    .then(() => {
        console.log("Connected to MongoDB!!!")
    })
    .catch((err) => {
        console.log("Failed to connect mongoDB");
        console.log(err)
    })
 
    // For Handling the CORS error :)
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
        );
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        );
        next();
      });


app.post("/register",(req,res) => {
   // console.log(req.body);
    bcrypt.hash(req.body.password,10)
    .then((hashedPassword) => {
        const user = new User({
            email:req.body.email,
            password:hashedPassword
        })
        user.save()
        .then((result) => {
            res.status(201).send({
                message:"User saved Successfully!",
                result
            })
        }).catch((err) => {
           res.status(500).send({
            message:"Unable to save new User",
            err
           })
        })
    }).catch((err) => {
        res.status(500).send({
            message:"Failed to hash the password",
            err
        })
    })
})


app.post("/login",(req,res) => {
    User.findOne({email:req.body.email})
    .then((user) => {
          bcrypt.compare(req.body.password,user.password)
          .then((match) => {
               if(!match){
                return res.status(500).send({message:"passwords do not match"})
               }

               const token = jwt.sign({userId:user._id,userEmail:user.email},"SSSEECCRRREEETTTT")
               
               res.status(200).send({message:"Login Successfull",email:user.email,token})
          })
    }).catch((error) => {
        res.status(500).send({message:"Email not Found, Please register before login",error})
    })
})

app.get("/free-endpoint",(req,res) => {
    res.json({message:"You are free to access this!"})
})

app.get("/auth-endpoint",authorize,(req,res) => {
    res.json({message:"You are authorized to access this!"})
})

app.listen(port,() => {
    console.log(`server started running on port ${port}`)
})

