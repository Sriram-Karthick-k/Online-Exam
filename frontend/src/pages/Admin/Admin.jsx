import react, { useState } from "react"
import imageCompression from 'browser-image-compression';
import Error from "../../components/Error"

function Admin() {
  const menuInitial = "1"
  const addParticipantsInitial = "1"
  const errorInitial = { imageSize: true }
  const [menu, setMenu] = useState(menuInitial)
  const [addParticipants, setAddParticipants] = useState(addParticipantsInitial)
  const [compressedImage, setCompreseedImage] = useState(false)
  const [error, setError] = useState(errorInitial)
  function changeMenu(e) {
    var target = e.target.id.split("-")[2]
    if (target === "1") {
      setMenu("1")
    } else if (target === "2") {
      setMenu("2")
    } else if (target === "3") {
      setMenu("3")
    } else {
      setMenu("4")
    }
  }
  function addParticipantsMenu(e) {
    var target = e.target.id.split("-")[2]
    if (target === "1") {
      setAddParticipants("1")
      setCompreseedImage(false)
      document.getElementById("imageUpload").value = null
    } else {
      setCompreseedImage(false)
      setAddParticipants("2")
      document.getElementById("imageUpload").value = null
    }
  }
  function studentAdd() {
    var studentDetails = {}
    studentDetails.registerNumber = document.getElementById("registerNumber").value
    studentDetails.registerName = document.getElementById("registerName").value
    studentDetails.registerMail = document.getElementById("registerMail").value
    studentDetails.registerDOB = document.getElementById("registerDOB").value
    studentDetails.registerPhoneNumber = document.getElementById("registerPhoneNumber").value
    studentDetails.registerDepartment = document.getElementById("registerDepartment").value
    studentDetails.registerYear = document.getElementById("registerYear").value
    studentDetails.registerBatch = document.getElementById("registerBatch").value
  }
  function teacherAdd() {
    console.log("yes")
  }
  // function findDate() {
  //   var today = new Date();
  //   var dd = String(today.getDate()).padStart(2, '0');
  //   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //   var yyyy = today.getFullYear();
  //   today = dd + '-' + mm + '-' + yyyy;
  //   return (today)
  // }
  async function compressImage(event) {
    const imageFile = event.target.files[0];
    // console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: .100,
      maxWidthOrHeight: 150,
      useWebWorker: true
    }
    try {
      var compressedFile = await imageCompression(imageFile, options);
      console.log(`compressedFile size ${compressedFile.size}`); // smaller than maxSizeMB
      var imageUrl = URL.createObjectURL(compressedFile)
      setCompreseedImage(imageUrl)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="admin copy-text">
      <div className="admin-index container">
        <div className="row menu">
          <div id="nav-item-1" onClick={changeMenu} className={menu === "1" ? "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center menu-item-active" : "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center"}>
            <p id="nav-p-1">Add participants</p>
          </div>
          <div id="nav-item-2" onClick={changeMenu} className={menu === "2" ? "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center menu-item-active" : "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center"}>
            <p id="nav-p-2">View participants</p>
          </div>
          <div id="nav-item-3" onClick={changeMenu} className={menu === "3" ? "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center menu-item-active" : "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center"}>
            <p id="nav-p-3">Create Test / Edit test</p>
          </div>
          <div id="nav-item-4" onClick={changeMenu} className={menu === "4" ? "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center menu-item-active" : "menu-item col col-lg-3 col-md-3 col-sm-3 col-3 text-center"}>
            <p id="nav-p-4">View Saved</p>
          </div>
        </div>
        {
          menu === "1" ?
            <div className="addParticipants">
              <div className="row menu text-center">
                <div id="addParticipants-item-1" onClick={addParticipantsMenu} className={addParticipants === "1" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
                  <p id="addParticipants-p-1">Student</p>
                </div>
                <div id="addParticipants-item-2" onClick={addParticipantsMenu} className={addParticipants === "2" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
                  <p id="addParticipants-p-2" >Teacher</p>
                </div>
              </div>
              {
                addParticipants === "1" ?

                  <div className="row register">
                    <div className="image-div">
                      <img className="uploaded-image" src={compressedImage ? compressedImage : "./images/profile.png"} alt="imageLogo" />
                      <input type="file" className="upload-file" name="imageUpload" id="imageUpload" accept=".jpg" onChange={compressImage} />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Register number :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="number" name="registerNumber" id="registerNumber" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Name :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="text" name="registerName" id="registerName" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Mail Id :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="mail" name="registerMail" id="registerMail" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Date of Birth :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="date" name="registerDOB" id="registerDOB" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Phone Number :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="number" name="registerPhoneNumber" id="registerPhoneNumber" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Department :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="text" name="registerDepartment" id="registerDepartment" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Year :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="number" name="registerYear" id="registerYear" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Batch :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="number" name="registerBatch" id="registerBatch" />
                    </div>
                    <div onClick={studentAdd} className="button text-center col col-lg-4 col-md-4 col-sm-4 col-4">
                      <p className="button-submit">Add</p>
                    </div>
                  </div>
                  :
                  <div className="row register">
                    <div className="image-div">
                      <img className="uploaded-image" src={compressedImage ? compressedImage : "./images/profile.png"} alt="imageLogo" />
                      <input type="file" className="upload-file" name="imageUpload" id="imageUpload" accept=".jpg" onChange={compressImage} />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Teacher Name :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="text" name="registerName" id="registerName" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Teacher Id :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="text" name="registerID" id="registerID" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Teacher password :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="password" name="registerPassword" id="registerPassword" />
                    </div>
                    <div className="register-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                      <p>Deaprtment :</p>
                    </div>
                    <div className="register-input col col-lg-6 col-md-6 col-sm-6 col-6">
                      <input className="input" type="text" name="registerDepartment" id="registerDepartment" />
                    </div>
                    <div onClick={teacherAdd} className="button text-center col col-lg-4 col-md-4 col-sm-4 col-4">
                      <p className="button-submit">Add</p>
                    </div>
                  </div>
              }
            </div>
            : menu === "2" ?
              <div className="viewParticipants">
                <div className="row">

                </div>
              </div>
              : menu === "3" ?
                <div className="createTest">
                  <div className="row">

                  </div>
                </div>
                :
                <div className="viewSaved">
                  <div className="row">

                  </div>
                </div>
        }
      </div>
    </div>
  )
}

export default Admin;