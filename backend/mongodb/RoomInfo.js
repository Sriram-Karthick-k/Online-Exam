//RoomInfo test Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var roominfo = new Schema({
  examName:String,
  registerNumber:[],
  roomNumber:{type:String,unique:true},
  teacherId:String
});
var RoomInfo = mongoose.model("RoomInfo", roominfo);
module.exports=RoomInfo
