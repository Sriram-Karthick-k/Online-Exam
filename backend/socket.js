//imports
const express = require('express');
const app=express()
const http=require('http')
const bodyParser=require("body-parser")
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const cors = require('cors');

io.on("connection",socket=>{
  socket.on('sendMessage',body=>{
    console.log(body)
  })
})
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))

server.listen(3002,function(req,res){
  console.log("Socket is started at 3002");
})