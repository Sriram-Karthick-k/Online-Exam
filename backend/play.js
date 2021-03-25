const fs = require("fs")

if(fs.existsSync("source/images")){
  console.log("found")
}else{
  fs.mkdirSync('source/images', { recursive: true })
}