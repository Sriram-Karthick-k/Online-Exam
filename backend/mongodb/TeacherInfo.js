//teachersinfos Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var teacherinfos = new Schema({
  teacherRegisterName:String,
  teacherRegisterID:{type:String,unique:true},
  teacherRegisterPassword:String,
  teacherMailID:String,
  teacherDepartment:String,
  imagePath:String
});
var TeacherInfo = mongoose.model("TeacherInfo", teacherinfos);
module.exports=TeacherInfo
