const mongoose=require("mongoose")
const AdminInfos=require("../Admin")
const bcrypt=require("bcrypt")

userName-admin1,password-123456
userName-admin2,password-asdfgh
bcrypt.hash("asdfgh",10,function(err,hash){
  var create=new AdminInfos({
    userName:"admin2",
    password:hash
  })
  create.save().catch(error=>{
    console.log(error)
  })
})