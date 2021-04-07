//imports
const express = require('express');
const app = express()
const http = require('http')
const path = require("path")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
require("dotenv").config()
const fs = require("fs")
const multer = require('multer');
const server = http.createServer(app);
const cors = require('cors');
const jwt = require("jsonwebtoken")
const uuid = require("uuid")
const socket = require("socket.io");
const io = socket(server);
//mongodb imports
const Main = require("./mongodb/Main")
const AdminInfo = require("./mongodb/Admin")
const StudentInfo = require("./mongodb/StudentInfo");
const TeacherInfo = require("./mongodb/TeacherInfo")
const ExamInfo = require("./mongodb/ExamInfo")
const AttendenceInfo = require("./mongodb/AttendenceInfo")
const RoomInfo = require("./mongodb/RoomInfo")



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
app.use(express.static(__dirname + "/source"))

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (req.body.page) {
      var details = JSON.parse(req.body.participant)
      var type = JSON.parse(req.body.type)
      var path = "source"
      var imagePath = details.imagePath.split("/").splice(0, details.imagePath.split("/").length - 1)
      imagePath.map(elem => {
        path += "/" + elem
      })
      if (type === "student") {
        removeFile("source" + details.imagePath)
        cb(null, path)
      } else {
        removeFile("source" + details.imagePath)
        cb(null, path)
      }
    } else {
      var details = JSON.parse(req.body.userDetails)
      if (details.type === "student") {
        var path = String("source/images/" + details.type + "/" + details.registerBatch + "/" + details.registerDepartment + "/" + details.registerYear)
        if (fs.existsSync(path)) {
          cb(null, path)
        } else {
          fs.mkdirSync(path, { recursive: true })
          cb(null, path)
        }
      } else {
        var path = String("source/images/" + details.type + "/" + details.registerDepartment)
        if (fs.existsSync(path)) {
          cb(null, path)
        } else {
          fs.mkdirSync(path, { recursive: true })
          cb(null, path)
        }
      }
    }

  },
  filename: function (req, file, cb) {
    if (req.body.page) {
      var details = JSON.parse(req.body.participant)
      var fileName = details.imagePath.split("/")
      cb(null, fileName[fileName.length - 1])
    } else {
      var details = JSON.parse(req.body.userDetails)
      if (details.registerNumber) {
        var fileName = details.registerNumber + "-" + details.registerDate
        cb(null, fileName)
      } else {
        var fileName = details.registerID + "-" + details.registerDate
        cb(null, fileName)
      }
    }
  }
})

var uploads = multer({ storage: storage })

var room = {}
var studentsOnline = {}
//routes
try{
io.on("connection", socket => {
  socket.on("connect to student room",data=>{
    socket.roomNumber=data.roomNumber
    socket.registerNumber=data.registerNumber
    socket.type="student"
    studentsOnline[data.registerNumber]=socket
    if(data.roomNumber in room){
      studentsOnline[data.registerNumber].emit("share video")
    }
  })
  socket.on("connect to teacher room",data=>{
    socket.registerNumber=data.registerNumber
    socket.teacherId=data.teacherId
    socket.roomNumber=data.roomNumber
    socket.type="teacher"
    room[data.roomNumber]=socket
    var registerNumber=data.registerNumber
    registerNumber.map(student=>{
      if(student in studentsOnline){
        studentsOnline[student].emit("share video again")
      }
    })
  })
  socket.on("give video",data=>{
    if(data.roomNumber in room){
      room[data.roomNumber].emit("get video",{signalData:data.signalData,from:data.from})
    }
  })
  socket.on("got video",data=>{
    studentsOnline[data.to].emit("video accepted",data)
  })
  socket.on("end student test",data=>{
    if(studentsOnline[data]){
      studentsOnline[data].emit("end test",{error:"Your test has been manually ended by the procter."})
    }
  })
  socket.on("disconnect-save",data=>{
    console.log(data)
  })
  socket.on("disconnect",()=>{
    if(socket.type==="student"){
      if(room[socket.roomNumber]){
        room[socket.roomNumber].emit("student left",{registerNumber:socket.registerNumber})
        delete studentsOnline[socket.registerNumber]
      }
    }else{
    var registerNumber=socket.registerNumber
      if(registerNumber){
        registerNumber.forEach(number => {
          if(number in studentsOnline){
            studentsOnline[number].emit("teacher left")
          }
        });
      }
      delete room[socket.roomNumber]
    }
  })
})
}catch(err){
  console.log(err)
}

app.route("/admin/login")
  .post(async function (req, res) {
    if (req.body.userName.length == 0 || req.body.password.length == 0) {
      res.send({ error: "Both the credentials are required." })
      return
    } else {
      if (Main.connection.readyState === 0) {
        res.send({ error: "The database server is offline." })
      } else {
        var userDetails = await AdminInfo.findOne({ userName: req.body.userName }).exec()
        if (userDetails) {
          if (await bcrypt.compare(req.body.password, userDetails.password)) {
            var token = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET, { expiresIn: '5h' })
            res.send({ user: userDetails.userName, jwt: token })
          } else {
            res.send({ error: "Password is invalid." })
          }
        } else {
          res.send({ error: "Username is invalid." })
        }
      }
    }
  })

app.get("/Auth", function (req, res) {
  var token = req.query.token
  try {
    var verified = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    console.log(e)
  }
  if (verified) {
    res.send({ loggedIn: true })
  } else {
    res.send({ loggedIn: false })
  }
})

//adding data to data bases
app.route("/admin/insert/student")
  .post(verifyToken, uploads.single("compressedImageFile"), async function (req, res, next) {
    var details = JSON.parse(req.body.userDetails)
    var fileName = details.registerNumber + "-" + details.registerDate
    var path = String("source/images/" + details.type + "/" + details.registerBatch + "/" + details.registerDepartment + "/" + details.registerYear + "/" + fileName)
    if (Main.connection.readyState === 0) {
      removeFile(path)
      res.send({ error: "The data base server is offline." })
    } else {
      var check = await StudentInfo.findOne({ studentRegisterNumber: details.registerNumber }).exec()
      if (!check) {
        var create = new StudentInfo({
          studentRegisterNumber: details.registerNumber,
          studentName: details.registerName,
          studentMailId: details.registerMail,
          studentDOB: details.registerDOB,
          studentPhoneNumber: details.registerPhoneNumber,
          studentDepartment: details.registerDepartment,
          studentYear: details.registerYear,
          studentBatch: details.registerBatch,
          imagePath: path
        })
        create.save()
          .then(() => {
            res.send({ success: "The student is added successfully." })
          })
          .catch(err => {
            removeFile(path)
            res.send({ error: "The register number is already exits." })
          })
      } else {
        removeFile(path)
        res.send({ error: "The register number is already exits." })
      }
    }

  })


app.route("/admin/insert/teacher")
  .post(verifyToken, uploads.single("compressedImageFile"), async function (req, res) {
    var details = JSON.parse(req.body.userDetails)
    var fileName = details.registerID + "-" + details.registerDate
    var path = String("source/images/" + details.type + "/" + details.registerDepartment + "/" + fileName)
    if (Main.connection.readyState === 0) {
      res.send({ error: "The data base server is offline." })
      removeFile(path)
    } else {
      var check = await TeacherInfo.findOne({ teacherRegisterID: details.registerID }).exec()
      if (!check) {
        bcrypt.hash(details.registerPassword, 10, function (err, hasedPassword) {
          var password = hasedPassword
          var create = new TeacherInfo({
            teacherRegisterName: details.registerName,
            teacherRegisterID: details.registerID,
            teacherRegisterPassword: password,
            teacherDepartment: details.registerDepartment,
            teacherMailID: details.registerMailID,
            imagePath: path
          })
          create.save()
            .then(() => res.send({ success: "The Teacher is added successfully." }))
            .catch(err => {
              removeFile(path)
              res.send({ error: "The ID already exits." })
            })
        })
      } else {
        removeFile(path)
        res.send({ error: "The ID already exits." })
      }
    }
  })


app.route("/admin/getparticipants")
  .get(verifyToken, async function (req, res) {
    if (Main.connection.readyState === 1) {
      var participants = {}
      var studentParticipants = await StudentInfo.find({}, { _id: 0, studentRegisterNumber: 1, studentBatch: 1, studentDepartment: 1, studentYear: 1 }).exec()
      var teacherParticipants = await TeacherInfo.find({}, { _id: 0, teacherRegisterID: 1, teacherDepartment: 1 }).exec()
      var studentBatch = await StudentInfo.distinct("studentBatch").exec()
      var teacherDepartment = await TeacherInfo.distinct("teacherDepartment").exec()
      var studentDepartment = await StudentInfo.distinct("studentDepartment").exec()
      var studentYear = await StudentInfo.distinct("studentYear").exec()
      participants.students = studentParticipants
      participants.teachers = teacherParticipants
      participants.studentBatch = studentBatch
      participants.studentYear = studentYear
      participants.teacherDepartment = teacherDepartment
      participants.studentDepartment = studentDepartment
      res.send(participants)
    } else {
      res.send({ error: "The database server is offline" })
    }
  })

app.route("/admin/getParticipantDetails")
  .get(verifyToken, async function (req, res) {
    if (Main.connection.readyState === 1) {
      var details = null
      if (req.query.type == "student") {
        details = await StudentInfo.findOne({ studentRegisterNumber: req.query.find }, { _id: 0 }).exec().catch(err => console.log(err))
      } else {
        details = await TeacherInfo.findOne({ teacherRegisterID: req.query.find }, { _id: 0, teacherRegisterPassword: 0 }).exec().catch(err => console.log(err))
      }
      var path = details.imagePath.split("/").splice(1, details.imagePath.split("/").length)
      var sendPath = ""
      path.map(elem => {
        sendPath += "/" + elem
      })
      details.imagePath = sendPath
      if (details) {
        res.send(details)
      } else {
        res.send({ error: "invalid details" })
      }
    } else {
      res.send({ error: "The database server is offline" })
    }
  })

app.post("/admin/deleteparticipant", verifyToken, async function (req, res) {
  if (Main.connection.readyState === 1) {
    var details = null
    if (req.body.type === "teacher") {
      details = await TeacherInfo.findOneAndRemove({ teacherRegisterID: req.body.participant.teacherRegisterID }).exec().catch(err => { console.log(err) })
      removeFile("source/" + req.body.participant.imagePath)
    } else {
      details = await StudentInfo.findOneAndRemove({ studentRegisterNumber: req.body.participant.studentRegisterNumber }).exec().catch(err => { console.log(err); })
      removeFile("source/" + req.body.participant.imagePath)
    }
    if (details._id) {
      res.send({ success: "The participant is successfully deleted." })
    } else {
      res.send({ error: "The participant is not deleted." })
    }
  } else {
    res.send({ error: "The database server is offline" })
  }
})
app.post("/admin/updateimage", verifyToken, uploads.single("file"), async function (req, res) {
  if (Main.connection.readyState === 1) {
    res.send({ success: "The file is updated" })
  } else {
    res.send({ error: "The database server is offline" })
  }
})

app.get("/admin/getParticipantsYearDepartmentBatch", verifyToken, async function (req, res) {
  if (Main.connection.readyState === 1) {
    var studentBatch = await StudentInfo.distinct("studentBatch").exec()
    var studentDepartment = await StudentInfo.distinct("studentDepartment").exec()
    var studentYear = await StudentInfo.distinct("studentYear").exec()
    res.send({ batch: studentBatch, department: studentDepartment, year: studentYear })
  } else {
    res.send({ error: "The database server is offline." })
  }
})

app.post("/admin/create-test", verifyToken, async function (req, res) {
  if (Main.connection.readyState === 1) {
    var examName = req.body.date + "-" + req.body.batch + "-" + req.body.department + "-" + req.body.year + "-" + req.body.subjectName + "-" + req.body.fromTime + "-" + req.body.toTime
    var registerNumber = await StudentInfo.find({ studentBatch: req.body.batch, studentDepartment: req.body.department, studentYear: req.body.year }, { _id: 0, studentRegisterNumber: 1 }).exec()
    var teacherId = await TeacherInfo.find({}, { _id: 0, teacherRegisterID: 1 }).exec()
    var registerNumbersArray = []
    for (var i = 0; i < registerNumber.length; i++) {
      registerNumbersArray.push(registerNumber[i].studentRegisterNumber)
      registerNumber[i] = {
        registerNumber: registerNumber[i].studentRegisterNumber,
        attendence: false
      }
    }
    var studentLength = registerNumber.length
    while (studentLength != 0) {
      var roomId = uuid.v1()
      var randomIndex = null
      var randomChecked = []
      while (randomIndex === null) {
        if (randomChecked >= teacherId.length) {
          break
        } else {
          var random = null
          while (random === null) {
            var randomNumber = Math.floor(Math.random() * teacherId.length)
            if (randomChecked.indexOf(randomNumber) == -1) {
              random = randomNumber
            }
          }
          var teacherIsAvailable = await RoomInfo.find({ teacherId: teacherId[random].teacherRegisterID, examName: { $regex: req.body.date + "-" } }).exec()
          if (teacherIsAvailable.length === 1) {
            randomChecked.push(random)
          } else {
            randomIndex = random
            break
          }
        }
      }
      if (randomIndex == null) {
        res.send({ error: "No teacher is available at that time" })
        return
      }
      if (studentLength >= 20) {
        var roomCreate = new RoomInfo({
          examName: examName,
          registerNumber: registerNumbersArray.splice(0, 20),
          roomNumber: roomId,
          teacherId: teacherId[randomIndex].teacherRegisterID
        })
        studentLength = studentLength - 20
      } else {
        var roomCreate = new RoomInfo({
          examName: examName,
          registerNumber: registerNumbersArray.splice(0, studentLength),
          roomNumber: roomId,
          teacherId: teacherId[randomIndex].teacherRegisterID
        })
        studentLength = 0
      }
      roomCreate.save()
    }

    var examCreate = new ExamInfo(req.body)
    var attendenceCreate = new AttendenceInfo({
      examName: examName,
      attendence: registerNumber
    })

    examCreate.save()
    attendenceCreate.save()
    res.send({ success: "The test has been created successfully." })
  } else {
    res.send({ error: "The database server is offline." })
  }
})

app.get("/admin/getExamDetails", verifyToken, async function (req, res) {
  if (Main.connection.readyState === 1) {
    var examDetails = await ExamInfo.find({}).exec()
    res.send(examDetails)
  } else {
    res.send({ error: "The database server is offline" })
  }
})

app.post("/admin/deleteExam", verifyToken, async function (req, res) {
  if (Main.connection.readyState === 1) {
    var examDetails = await ExamInfo.findOneAndRemove(req.body).exec()
    var examName = req.body.date + "-" + req.body.batch + "-" + req.body.department + "-" + req.body.year + "-" + req.body.subjectName + "-" + req.body.fromTime + "-" + req.body.toTime
    var roomDetails = await RoomInfo.deleteMany({ examName: examName }).exec()
    var attendenceDetails = await AttendenceInfo.findOneAndRemove({ examName: examName }).exec()
    if (examDetails._id && attendenceDetails._id) {
      res.send({ success: "The exam is successfully deleted" })
    } else {
      res.send({ error: "The Exam is not deleted successfully" })
    }
  } else {
    res.send({ error: "The databse server is offline" })
  }
})


app.post("/student/login", async function (req, res) {
  if (Main.connection.readyState === 1) {
    var student = await StudentInfo.findOne({ studentRegisterNumber: req.body.registerNumber }).exec()
    if (!student) {
      res.send({ error: "invalid student register number." })
      return
    }
    if (student.studentDOB !== req.body.date) {
      res.send({ error: "Date of birth didn't match with register number." })
      return
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var regex = yyyy + "-" + mm + "-" + dd + "-" + student.studentBatch + "-" + student.studentDepartment + "-" + student.studentYear + "-"
    console.log(regex);
    var room = await RoomInfo.find({ "examName": { $regex: regex, $options: 'i' }, registerNumber: { $all: [student.studentRegisterNumber] } }, { _id: 0, registerNumber: 0, teacherId: 0, __v: 0 }).exec()
    console.log(room);
    if (room.length > 0) {
      var index = null
      var time = null
      var presentTime = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes()
      for (var i = 0; i < room.length; i++) {
        for (var j = i; j < room.length; j++) {
          var indexTime = room[i].examName.split("-")[room[i].examName.split("-").length - 2]
          var indexTime1 = room[j].examName.split("-")[room[j].examName.split("-").length - 2]
          if (indexTime > indexTime1) {
            var temp = room[i]
            room[i] = room[j]
            room[j] = temp
          }
        }
      }
      for (var i = 0; i < room.length; i++) {
        var indexTime = room[i].examName.split("-")[room[i].examName.split("-").length - 1]
        if (presentTime < indexTime) {
          index = i
          break
        }
      }
      var minimum = room[index].examName.split("-")
      console.log("sorted")
      console.log(room);
      if (index !== null) {
        if (minimum[minimum.length - 2] > presentTime) {
          if (Number(minimum[minimum.length - 2].split(":")[0]) - Number(presentTime.split(":")[0]) === 1) {
            console.log(((60 - Number(presentTime.split(":")[1])) + Number(minimum[minimum.length - 2].split(":")[1])))
            if (((60 - Number(presentTime.split(":")[1])) + Number(minimum[minimum.length - 2].split(":")[1])) <= 15) {
              var token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '5h' })
              res.send({room:room[index],token:token})
            } else {
              res.send({ error: "Login before 15 minutes..." })
            }
          } else {
            if (Number(minimum[minimum.length - 2].split(":")[0]) - Number(presentTime.split(":")[0]) === 0) {
              if ((Number(minimum[minimum.length - 2].split(":")[1]) - Number(presentTime.split(":")[1])) <= 15) {
                var token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '5h' })
                res.send({room:room[index],token:token})
              } else {
                res.send({ error: "Login before 15 minutes..." })
              }
            } else {
              res.send({ error: "Login before 15 minutes..." })
            }
          }
        } else {
          var token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '5h' })
          res.send({room:room[index],token:token})
        }
      } else {
        res.send({ error: "Exam is finished" })
      }
      console.log("index-" + index);
    } else {
      res.send({ error: "There is no exam today..." })
    }
  } else {
    res.send({ error: "The database server is offline." })
  }
})


app.post("/teacher/login", async function (req, res) {
  if (Main.connection.readyState === 1) {
    var teacherDetails = await TeacherInfo.findOne({ teacherRegisterID: req.body.teacherId }).exec()
    if (teacherDetails) {
      var result = await bcrypt.compare(req.body.password, teacherDetails.teacherRegisterPassword)
      if (result) {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var regex = yyyy + "-" + mm + "-" + dd
        var room = await RoomInfo.find({ examName: { $regex: regex, $options: "i" }, teacherId: teacherDetails.teacherRegisterID }).exec()
        if (room.length > 0) {
          var index = null
          var time = null
          var presentTime = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes()
          for (var i = 0; i < room.length; i++) {
            for (var j = i; j < room.length; j++) {
              var indexTime = room[i].examName.split("-")[room[i].examName.split("-").length - 2]
              var indexTime1 = room[j].examName.split("-")[room[j].examName.split("-").length - 2]
              if (indexTime > indexTime1) {
                var temp = room[i]
                room[i] = room[j]
                room[j] = temp
              }
            }
          }
          for (var i = 0; i < room.length; i++) {
            var indexTime = room[i].examName.split("-")[room[i].examName.split("-").length - 1]
            if (presentTime < indexTime) {
              index = i
              break
            }
          }
          var minimum = room[index].examName.split("-")
          console.log("sorted")
          console.log(room);
          if (index !== null) {
            if (minimum[minimum.length - 2] > presentTime) {
              if (Number(minimum[minimum.length - 2].split(":")[0]) - Number(presentTime.split(":")[0]) === 1) {
                console.log(((60 - Number(presentTime.split(":")[1])) + Number(minimum[minimum.length - 2].split(":")[1])))
                if (((60 - Number(presentTime.split(":")[1])) + Number(minimum[minimum.length - 2].split(":")[1])) <= 20) {
                  res.send(room[index])
                } else {
                  res.send({ error: "Login before 20 minutes..." })
                }
              } else {
                if (Number(minimum[minimum.length - 2].split(":")[0]) - Number(presentTime.split(":")[0]) === 0) {
                  if ((Number(minimum[minimum.length - 2].split(":")[1]) - Number(presentTime.split(":")[1])) <= 20) {
                    res.send(room[index])
                  } else {
                    res.send({ error: "Login before 20 minutes..." })
                  }
                } else {
                  res.send({ error: "Login before 20 minutes..." })
                }
              }
            } else {
              res.send(room[index])
            }
          } else {
            res.send({ error: "Exam is finished" })
          }
          console.log("index-" + index);
        } else {
          res.send({ error: "There is no exam today..." })
        }
      } else {
        res.send({ error: "Invalid password." })
      }
    } else {
      res.send({ error: "The user Name is invalid." })
    }
  } else {
    res.send({ error: "The database server is offline." })
  }

})

app.get("/student/getQuestion",verifyToken,async function(req,res){
  var examName=req.query.examName.split("-")
  var batch=examName[3]
  var date=examName[0]+"-"+examName[1]+"-"+examName[2]
  var department=examName[4]
  var year=examName[5]
  var subjectName=examName[6]
  var fromTime=examName[7]
  var toTime=examName[8]
  var questions=await ExamInfo.findOne({subjectName:subjectName,date:date,fromTime:fromTime,toTime:toTime,batch:batch,year:year,department:department},{_id:0,oneMark:1,twoMark:1}).exec()
  if(questions){
    var oneMark=[]
    var twoMark=[]
    for(var i =0;i<questions.oneMark.length;i++){
      var obj={}
      obj.questionNumber=questions.oneMark[i].questionNumber
      obj.question=questions.oneMark[i].question
      obj.optionA=questions.oneMark[i].optionA
      obj.optionB=questions.oneMark[i].optionB
      obj.optionC=questions.oneMark[i].optionC
      obj.optionD=questions.oneMark[i].optionD
      oneMark.push(obj)
    }
    for(var i =0;i<questions.twoMark.length;i++){
      var obj={}
      obj.questionNumber=questions.twoMark[i].questionNumber
      obj.question=questions.twoMark[i].question
      obj.optionA=questions.twoMark[i].optionA
      obj.optionB=questions.twoMark[i].optionB
      obj.optionC=questions.twoMark[i].optionC
      obj.optionD=questions.twoMark[i].optionD
      twoMark.push(obj)
    }
    res.send({oneMark:oneMark,twoMark:twoMark})
  }else{
    res.send({error:"There is no exam like that"})
  }
  
})

function verifyToken(req, res, next) {
  var token = req.headers.authorization.split(" ")[1]
  try {
    var verified = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    console.log(e)
  }
  if (verified) {
    next()
  } else {
    res.send({ error: "not valid jwt" })
  }
}
function removeFile(path) {
  fs.unlinkSync(path)
}

//server listen
server.listen(3001, function (res) {
  console.log("app is running in 3001")
})