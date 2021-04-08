//AttendenceInfo test Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var answerinfo = new Schema({
  examName:String,
  answers:[]
});
var AnswerInfos = mongoose.model("AnswerInfos", answerinfo);
module.exports=AnswerInfos
