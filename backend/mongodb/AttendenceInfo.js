//AttendenceInfo test Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var attendenceinfo = new Schema({
  examName:String,
  attendence:[]
});
var AttendenceInfos = mongoose.model("AttendenceInfos", attendenceinfo);
module.exports=AttendenceInfos
