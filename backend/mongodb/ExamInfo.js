//ExamInfos test Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var examinfo = new Schema({
  subjectName:String,
  subjectCode:String,
  date:String,
  fromTime:String,
  toTime:String,
  batch:String,
  year:String,
  department:String,
  oneMark:[],
  twoMark:[]
});
var ExamInfos = mongoose.model("ExamInfos", examinfo);
module.exports=ExamInfos
