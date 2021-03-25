var department = ["CSE", "MECHANICAL", "ECE", "EEE", "CIVIL"]
var alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var alphNumberic = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
var user = []
var promise = []
for (var i = 0; i < department.length; i++) {
  for (var j = 0; j < 20; j++) {
    var teacherDetails = {}
    var name = ""
    var nameLength = Math.floor(Math.random() * 10) + 5
    for (var l = 0; l < nameLength; l++) {
      name += alph[Math.floor(Math.random() * 26)]
    }
    var teacherID = ""
    for (var l = 0; l < 10; l++) {
      teacherID += alphNumberic[Math.floor(Math.random() * 36)]
    }
    teacherDetails.registerName = name
    teacherDetails.registerID = teacherID
    teacherDetails.registerPassword = "123456"
    teacherDetails.registerDepartment = department[i]
    teacherDetails.registerMailID = name + "@gmail.com"
    teacherDetails.type = "teacher"
    var date = new Date()
    teacherDetails.registerDate = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getFullYear()
    const data = new FormData()
    data.append("userDetails", JSON.stringify(teacherDetails))
    data.append("compressedImageFile", compressedImageFile)
    var token = JSON.parse(localStorage.getItem("UserData"))
    promise.push(
      Axios
        .post("/insert/teacher", data, {
          headers: {
            'Authorization': `token ${token.jwt}`
          }
        })
        .then(res => {
          user.push(res)
        })
        .catch(err => console.log(err))
    )
  }
}
Promise.all(promise).then(() => console.log("finished"))