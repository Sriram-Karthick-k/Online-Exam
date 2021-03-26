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
const Main = require("./mongodb/Main")
const AdminInfo=require("./mongodb/Admin")
const StudentInfo=require("./mongodb/StudentInfo"); 
const TeacherInfo=require("./mongodb/TeacherInfo")

//socket config

io.on("connection",socket=>{
  socket.on('sendMessage',body=>{
    console.log(body)
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
app.use(express.static(__dirname+"/source"))

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    var details=JSON.parse(req.body.userDetails)
    if(details.type==="student"){
      var path=String("source/images/"+details.type+"/"+details.registerBatch+"/"+details.registerDepartment+"/"+details.registerYear)
      if(fs.existsSync(path)){
        cb(null,path)
      }else{
        fs.mkdirSync(path,{recursive:true})
        cb(null,path)
      }
    }else{
      var path=String("source/images/"+details.type+"/"+details.registerDepartment)
      if(fs.existsSync(path)){
        cb(null,path)
      }else{
        fs.mkdirSync(path,{recursive:true})
        cb(null,path)
      }
    }
  },
  filename: function (req, file, cb) {
    var details=JSON.parse(req.body.userDetails)
    if(details.registerNumber){
      var fileName=details.registerNumber+"-"+details.registerDate
      cb(null,fileName)
    }else{
      var fileName=details.registerID+"-"+details.registerDate
      cb(null,fileName)
    }
  }
})
 
var uploads = multer({ storage: storage })
//routes
app.route("/admin-login")
  .post(async function(req,res){
    if(req.body.userName.length==0 || req.body.password.length==0){
      res.send({error:"Both the credentials are required."})
      return
    }else{
      if(Main.connection.readyState===0){
        res.send({error:"The database server is offline."})
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
    }
  })

app.get("/Auth",function(req,res){
  var token=req.query.token
  try{
    var verified=jwt.verify(token,process.env.JWT_SECRET)
  }catch(e){
    console.log(e)
  }
  if(verified){
    res.send({loggedIn:true})
  }else{
    res.send({loggedIn:false})
  }
})

//adding data to data bases
app.route("/insert/student")
  .post(verifyToken,uploads.single("compressedImageFile"), async function(req,res,next){
    var details=JSON.parse(req.body.userDetails)
    var fileName=details.registerNumber+"-"+details.registerDate
    var path=String("source/images/"+details.type+"/"+details.registerBatch+"/"+details.registerDepartment+"/"+details.registerYear+"/"+fileName)
    if(Main.connection.readyState===0){
      removeFile(path)
      res.send({error:"The data base server is offline."})
    }else{
      var check=await StudentInfo.findOne({studentRegisterNumber:details.registerNumber}).exec()
      if(!check){
        var create= new StudentInfo({
          studentRegisterNumber:details.registerNumber,
          studentName:details.registerName,
          studentMailId:details.registerMail,
          studentDOB:details.registerDOB,
          studentPhoneNumber:details.registerPhoneNumber,
          studentDepartment:details.registerDepartment,
          studentYear:details.registerYear,
          studentBatch:details.registerBatch,
          imagePath:path
        })
        create.save()
          .then(()=>{ 
            res.send({success:"The student is added successfully."})
          })
          .catch(err=>{
            removeFile(path)
            res.send({error:"The register number is already exits."})
          })
      }else{
        removeFile(path)
        res.send({error:"The register number is already exits."})
      }
    }
    
  })


app.route("/insert/teacher")
  .post(verifyToken,uploads.single("compressedImageFile"),async function(req,res){
    var details=JSON.parse(req.body.userDetails)
    var fileName=details.registerID+"-"+details.registerDate
    var path=String("source/images/"+details.type+"/"+details.registerDepartment+"/"+fileName)
    if(Main.connection.readyState===0){
      res.send({error:"The data base server is offline."})
      removeFile(path)
    }else{
      var check=await TeacherInfo.findOne({teacherRegisterID:details.registerID}).exec()
      if(!check){
        bcrypt.hash(req.body.registerPassword,10,function(err,hasedPassword){
          var create= new TeacherInfo({
            teacherRegisterName:details.registerName,
            teacherRegisterID:details.registerID,
            teacherRegisterPassword:hasedPassword,
            teacherDepartment:details.registerDepartment,
            teacherMailID:details.registerMailID,
            imagePath:path
          })
            create.save()
              .then(()=> res.send({success:"The Teacher is added successfully."}))
              .catch(err=>{
                removeFile(path)
                res.send({error:"The ID already exits."})
              })
        }) 
      }else{
        removeFile(path)
        res.send({error:"The ID already exits."})
      }
    }
  })


app.route("/getparticipants")
  .get(verifyToken,async function(req,res){
    if(Main.connection.readyState===1){
      var participants={}
      var studentParticipants=await StudentInfo.find({},{_id:0,studentRegisterNumber:1,studentBatch:1,studentDepartment:1,studentYear:1}).exec()
      var teacherParticipants=await TeacherInfo.find({},{_id:0,teacherRegisterName:1,teacherDepartment:1}).exec()
      var studentBatch=await StudentInfo.distinct("studentBatch").exec()
      var teacherDepartment=await TeacherInfo.distinct("teacherDepartment").exec()
      var studentDepartment=await StudentInfo.distinct("studentDepartment").exec()
      var studentYear =await StudentInfo.distinct("studentYear").exec()
      participants.students=studentParticipants
      participants.teachers=teacherParticipants
      participants.studentBatch=studentBatch
      participants.studentYear=studentYear
      participants.teacherDepartment=teacherDepartment
      participants.studentDepartment=studentDepartment
      res.send(participants)
    }else{
      res.send({error:"The database server is offline"})
    }
  })
  

function verifyToken(req,res,next){
  var token = req.headers.authorization.split(" ")[1]
  try{
    var verified=jwt.verify(token,process.env.JWT_SECRET)
  }catch(e){
    console.log(e)
  }
  if(verified){
    next()
  }else{
    res.send({error:"not valid jwt"})
  }
  
}
function removeFile(path){
  fs.unlinkSync(path)
}

//server listen
server.listen(3001,function(res){
  console.log("app is running in 3001")
})