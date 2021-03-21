//imports
const express = require('express');
const app=express()
const http=require('http')
const bodyParser=require("body-parser")
const bcrypt=require("bcrypt")
require("dotenv").config()
const fs=require("fs")
const multer = require('multer');
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const cors = require('cors');
const jwt=require("jsonwebtoken")
//mongodb imports
const AdminInfo=require("./mongodb/Admin")

//socket config

io.on("connection",socket=>{
  socket.on('sendMessage',body=>{
    print(body)
  })
})

//config
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))

//routes
app.route("/admin-login")
  .post(async function(req,res){
    if(req.body.userName.length==0 || req.body.password.length==0){
      res.send({error:"Both the credentials are required."})
      return
    }else{
      var userDetails=await AdminInfo.findOne({userName:req.body.userName}).exec()
      if(userDetails){
       if( await bcrypt.compare(req.body.password,userDetails.password)){
        var token=jwt.sign({id:userDetails._id},process.env.JWT_SECRET, { expiresIn: '1h' })
        res.send({user:userDetails.userName,jwt:token})
       }else{
         res.send({error:"Password is invalid."})
       }
      }else{
        res.send({error:"Username is invalid."})
      }
    }
  })

//server listen
server.listen(3001,function(res){
  console.log("app is running in 3001")
})