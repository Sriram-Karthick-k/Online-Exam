//studentinfos Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var studentinfos = new Schema({
  studentRegisterNumber:{type:Number,unique:true},
  studentName:String,
  studentMailId:String,
  studentDOB:String,
  studentPhoneNumber:String,
  studentDepartment:String,
  studentYear:String,
  studentBatch:String,
  imagePath:String
});
var StudentInfo = mongoose.model("StudentInfo", studentinfos);
module.exports=StudentInfo
