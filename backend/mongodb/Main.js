const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/OnlineExam-DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => console.log(error));
module.exports=mongoose
