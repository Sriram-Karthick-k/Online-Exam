var batch = [2017, 2018, 2019, 2020, 2021];
    var year = ["First Year", "Second Year", "Third Year", "Fourth Year"];
    var department = ["CSE", "MECHANICAL", "ECE", "EEE", "CIVIL"]
    var alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var number = 31161910568801
    var user = []
    var promise = []
    for (var i = 4; i < 5; i++) {
      for (var j = 0; j < department.length; j++) {
        for (var k = 0; k < year.length; k++) {
          for (var m = 0; m < 40; m++) {
            var studentDetails = {}
            var name = ""
            var phoneNumber = ""
            for (var l = 0; l < 10; l++) {
              phoneNumber += Math.floor(Math.random() * 9)
            }
            var nameLength = Math.floor(Math.random() * 10) + 5
            for (var l = 0; l < nameLength; l++) {
              name += alph[Math.floor(Math.random() * 26)]
            }
            var date = Math.floor(Math.random() * 30) + 1
            date = (date < 10) ? ("0" + date) : date
            var month = Math.floor(Math.random() * 12) + 1
            month = (month < 10) ? ("0" + month) : month
            var dob = (Math.floor(Math.random() * (2003 - 1999)) + 1999) + "-" + month + "-" + date
            studentDetails.registerNumber = number
            studentDetails.registerName = name
            studentDetails.registerMail = name + "@gmail.com"
            studentDetails.registerDOB = dob
            studentDetails.registerPhoneNumber = phoneNumber
            studentDetails.registerDepartment = department[j]
            studentDetails.registerYear = year[k]
            studentDetails.registerBatch = batch[i]
            studentDetails.type = "student"
            var date = new Date()
            studentDetails.registerDate = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getFullYear()
            const data = new FormData()
            data.append("userDetails", JSON.stringify(studentDetails))
            data.append("compressedImageFile", compressedImageFile)
            number += 1
            promise.push(
              Axios
                .post("/insert/student", data, {
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
      }
    }
    Promise.all(promise).then(() => console.log("finished"))

    console.log("done")