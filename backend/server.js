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
//mongodb imports


//config
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))

//socket config

io.on("connection",socket=>{
  socket.on('sendMessage',body=>{
    print(body)
  })
})

app.get("/user",function(req,res){
  res.send({userName:"hello"})
})


//server listen
server.listen(3001,function(res){
  console.log("app is running in 3001")
})