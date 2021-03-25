//Admin Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var admininfos = new Schema({
  userName:{type:String,unique:true},
  password:{type:String,unique:false}
});
var AdminInfos = mongoose.model("AdminInfos", admininfos);
module.exports=AdminInfos
