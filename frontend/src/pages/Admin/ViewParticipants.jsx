import react, { useState, useEffect } from "react"
import Axios from "axios"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import imageCompression from 'browser-image-compression';

function ViewParticipants(props) {
  const errorInitial = { database: false, showParticipant: false }
  const studentDataInitial = {
    studentRegisterNumber: null,
    studentDepartment: null,
    studentYear: null,
    studentBatch: null
  }
  const addParticipantsInitial = "1"
  const [spinner, setSpinner] = useState(false)
  const [compressedImage, setCompreseedImage] = useState(false)
  const [compressedImageFile, setCompressedImageFile] = useState(false)
  const [addParticipants, setAddParticipants] = useState(addParticipantsInitial)
  const [studentData, setStudentData] = useState([])
  const [displayBatch, setDisplayBatch] = useState([])
  const [displayDepartment, setDisplayDepartment] = useState([])
  const [teacherData, setTeacherData] = useState([])
  const [displayTeacherDepartment, setDisplayTeacherDepartment] = useState([])
  const [error, setError] = useState(errorInitial)
  const [displayStudentYear, setDisplayStudentYear] = useState([])
  const [showParticipantType, setShowParticipantType] = useState(false)
  const [showParticipantDetails, setShowParticipantDetails] = useState(false)
  const [enableUpdate, setEnableUpdate] = useState(false)
  function addParticipantsMenu(e) {
    var target = e.target.id.split("-")[2]
    if (target === "1") {
      setSpinner(true)
      setError(errorInitial)
      setAddParticipants("1")
      setSpinner(false)
    } else {
      setSpinner(true)
      setError(errorInitial)
      setAddParticipants("2")
      setSpinner(false)
    }
  }
  useEffect(() => {
    setSpinner(true)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .get("/admin/getparticipants", {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError({ ...error, database: res.data.error })
          setSpinner(false)
        } else {
          setDisplayBatch(res.data.studentBatch)
          setDisplayDepartment(res.data.studentDepartment)
          setDisplayStudentYear(res.data.studentYear)
          setDisplayTeacherDepartment(res.data.teacherDepartment)
          setStudentData(res.data.students)
          setTeacherData(res.data.teachers)
          setSpinner(false)
        }
      })
      .catch(e => console.log(e))
  }, [])
  function dropDownBatch(e) {
    if (!(e.target.classList[1])) {
      document.getElementById(e.target.id).classList = ["batch-plus-img batch-plus-img-rotate"]
      displayDepartment.map(element => {
        document.getElementById(e.target.id + "-" + element + "-department").classList = ["department-container"]
      })
    } else {
      document.getElementById(e.target.id).classList = ["batch-plus-img"]
      displayDepartment.map(element => {
        document.getElementById(e.target.id + "-" + element + "-department").classList = ["department-container-none"]
      })
    }
  }
  function dropDownDepartment(e) {
    if (!(e.target.classList[1])) {
      document.getElementById(e.target.id).classList = ["department-plus-img department-plus-img-rotate"]
      displayStudentYear.map(element => {
        document.getElementById(e.target.id + "-" + element + "-year").classList = ["year-container"]
      })
    } else {
      document.getElementById(e.target.id).classList = ["department-plus-img"]
      displayStudentYear.map(element => {
        document.getElementById(e.target.id + "-" + element + "-year").classList = ["year-container-none"]
      })
    }
  }
  function dropDownYear(e) {
    if (!(e.target.classList[1])) {
      document.getElementById(e.target.id).classList = ["year-plus-img year-plus-img-rotate"]
      var id = e.target.id.split("-")
      studentData.map(element => {
        if ((id[0] === element.studentBatch) && (id[1] === element.studentDepartment) && (id[2] === element.studentYear)) {
          document.getElementById(e.target.id + "-wrapper").classList = ["student-wrapper"]
        }
      })
    } else {
      document.getElementById(e.target.id).classList = ["year-plus-img"]
      var id = e.target.id.split("-")
      studentData.map(element => {
        if ((id[0] === element.studentBatch) && (id[1] === element.studentDepartment) && (id[2] === element.studentYear)) {
          document.getElementById(e.target.id + "-wrapper").classList = ["student-wrapper-none"]
        }
      })
    }
  }

  function teacherDepartmentDropDown(e) {
    if (e.target.classList[1]) {
      document.getElementById(e.target.id).classList = ["teacher-department-plus-img"]
      var id = e.target.id.split("-")
      teacherData.map(element => {
        if (id[0] === element.teacherDepartment) {
          document.getElementById(id[0] + "-teacherwrapper").classList = ["teacher-wrapper-none"]
        }
      })
    } else {
      document.getElementById(e.target.id).classList = ["teacher-department-plus-img teacher-department-plus-img-rotate"]
      var id = e.target.id.split("-")
      teacherData.map(element => {
        if (id[0] === element.teacherDepartment) {
          document.getElementById(id[0] + "-teacherwrapper").classList = ["teacher-wrapper"]
        }
      })
    }
  }
  function showDetails(e) {
    setSpinner(true)
    var details = e.target.id.split("-")
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .get("/admin/getParticipantDetails?find=" + details[(details.length - 3)] + "&type=" + details[(details.length - 1)], {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        console.log(res.data)
        if (res.data.teacherRegisterID) {
          if (res.data.error) {
            setError({ ...error, showParticipant: res.data.error })
          }
          setShowParticipantType("teacher")
          setShowParticipantDetails(res.data)
          setCompreseedImage(res.data.imagePath)
          setSpinner(false)
        } else {
          setShowParticipantType("student")
          setShowParticipantDetails(res.data)
          setCompreseedImage(res.data.imagePath)
          setSpinner(false)
        }
      })
  }
  function closeParticipant(e) {
    if (e.target.id.split("-")[0] == "close") {
      setShowParticipantType(false)
      setShowParticipantDetails(false)
      setEnableUpdate(false)
      setError(errorInitial)
    }
  }
  async function compressImage(event) {
    setSpinner(true)
    const imageFile = event.target.files[0];
    if (!imageFile) {
      setSpinner(false)
      return
    }
    // console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: .100,
      maxWidthOrHeight: 200,
      useWebWorker: true
    }
    try {
      var compressedFile = await imageCompression(imageFile, options);
      console.log(`compressedFile size ${compressedFile.size}`); // smaller than maxSizeMB
      var imageUrl = URL.createObjectURL(compressedFile)
      setCompressedImageFile(compressedFile)
      setCompreseedImage(imageUrl)
      setEnableUpdate(true)
      setSpinner(false)
    } catch (error) {
      setSpinner(false)
      console.log(error);
    }
  }
  function deleteParticipant(e) {
    if (showParticipantType === "student") {
      setSpinner(true)
      var details = {
        participant: showParticipantDetails,
        type: showParticipantType
      }
      var token = JSON.parse(localStorage.getItem("UserData"))
      Axios
        .post("/admin/deleteparticipant", details, {
          headers: {
            'Authorization': `token ${token.jwt}`
          }
        })
        .then(res => {
          if (res.data.error) {
            setError(errorInitial)
            setError({ ...error, showParticipant: res.data.error })
          } else {
            setError(errorInitial)
            setError({ ...error, database: res.data.success })
            setStudentData(studentData.filter(element => element.studentRegisterNumber != showParticipantDetails.studentRegisterNumber))
            setShowParticipantDetails(false)
            setShowParticipantType(false)
            setSpinner(false)
          }
        })
    } else {
      setSpinner(true)
      setSpinner(true)
      var details = {
        participant: showParticipantDetails,
        type: showParticipantType
      }
      var token = JSON.parse(localStorage.getItem("UserData"))
      Axios
        .post("/admin/deleteparticipant", details, {
          headers: {
            'Authorization': `token ${token.jwt}`
          }
        })
        .then(res => {
          if (res.data.error) {
            setError(errorInitial)
            setError({ ...error, showParticipant: res.data.error })
          } else {
            setError(errorInitial)
            setError({ ...error, database: res.data.success })
            setTeacherData(teacherData.filter(element => element.teacherRegisterID != showParticipantDetails.teacherRegisterID))
            setShowParticipantDetails(false)
            setShowParticipantType(false)
            setSpinner(false)
          }
        })
    }
  }
  function updateImage(e) {
    setSpinner(true)
    var details = new FormData()
    details.append("participant", JSON.stringify(showParticipantDetails))
    details.append("type", JSON.stringify(showParticipantType))
    details.append("page", JSON.stringify({ page: "upload" }))
    details.append("file", compressedImageFile)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .post("/admin/updateimage", details, {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError(errorInitial)
          setError({ ...error, showParticipant: res.data.error })
        } else {
          setError(errorInitial)
          setCompreseedImage(false)
          setCompressedImageFile(false)
          setShowParticipantDetails(false)
          setEnableUpdate(false)
          setShowParticipantType(false)
          setSpinner(false)
          setError({ ...error, database: res.data.success })
        }
      })
      .catch(err => { console.log(err); })
  }
  var dump = 1
  return (
    <div className="viewParticipants">
      <Error text={error.database ? error.database : ""} class="error-text error-view-participants"></Error>
      <div className="row menu text-center">
        <div id="addParticipants-item-1" onClick={addParticipantsMenu} className={addParticipants === "1" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
          <p id="addParticipants-p-1">Student</p>
        </div>
        <div id="addParticipants-item-2" onClick={addParticipantsMenu} className={addParticipants === "2" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
          <p id="addParticipants-p-2" >Teacher</p>
        </div>
      </div>
      <div className="container">
        {
          addParticipants == "1" ?
            <div className="row">
              <div className="total-wrapper">
                {
                  displayBatch.map((batch) => {
                    return (
                      <div className="batch-container" key={batch}>
                        <div className="batch-holder" >
                          <h4 className="batch-text">{batch}</h4>
                          <img src="./images/plus.png" id={batch} onClick={dropDownBatch} className="batch-plus-img" alt="plus" />
                        </div>
                        {
                          displayDepartment.map((department) => {
                            return (
                              <div className="department-container-none" id={batch + "-" + department + "-" + "department"} key={department}>
                                <div className="department-holder">
                                  <h5 className="department-text">{department}</h5>
                                  <img src="./images/plus.png" id={batch + "-" + department} alt="plus" onClick={dropDownDepartment} className="department-plus-img" />
                                </div>
                                {
                                  displayStudentYear.map((year) => {
                                    return (
                                      <div className="year-container-none" id={batch + "-" + department + "-" + year + "-year"} key={year}>
                                        <div className="year-holder">
                                          <h6 className="year-text">{year}</h6>
                                          <img src="./images/plus.png" id={batch + "-" + department + "-" + year} onClick={dropDownYear} className="year-plus-img" alt="plus" />
                                        </div>
                                        <div className="student-wrapper-none" id={batch + "-" + department + "-" + year + "-wrapper"}>
                                          {
                                            studentData.map(student => {
                                              if ((student.studentBatch === batch) && (student.studentDepartment === department) && (student.studentYear === year)) {
                                                return (
                                                  <div className="student-container" key={student.studentRegisterNumber} onClick={showDetails} id={batch + "-" + department + "-" + year + "-" + student.studentRegisterNumber + "-container-student"}>
                                                    <div className="student-holder" id={batch + "-" + department + "-" + year + "-" + student.studentRegisterNumber + "-holder-student"}>
                                                      <h4 className="student-text" id={batch + "-" + department + "-" + year + "-" + student.studentRegisterNumber + "-text-student"}>{student.studentRegisterNumber}</h4>
                                                    </div>
                                                  </div>
                                                )
                                              }
                                            })
                                          }
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
            :
            <div className="row">
              <div className="total-wrapper">
                {
                  displayTeacherDepartment.map((department) => {
                    return (
                      <div className="teacher-department-container" key={department}>
                        <div className="teacher-department-holder" >
                          <h4 className="teacher-department-text">{department}</h4>
                          <img src="./images/plus.png" id={department + "-teacher"} onClick={teacherDepartmentDropDown} className="teacher-department-plus-img" alt="plus" />
                        </div>
                        <div className="teacher-wrapper-none" id={department + "-teacherwrapper"}>
                          {
                            teacherData.map((teacher) => {
                              if (department === teacher.teacherDepartment) {
                                return (
                                  <div className="teacher-container" onClick={showDetails} id={department + "-" + teacher.teacherRegisterID + "-container-teacher"} key={teacher.teacherRegisterID}>
                                    <div className="teacher-holder" id={department + "-" + teacher.teacherRegisterID + "-holder-teacher"}>
                                      <h4 className="teacher-text" id={department + "-" + teacher.teacherRegisterID + "-teacherText-teacher"}>{teacher.teacherRegisterID}</h4>
                                    </div>
                                  </div>
                                )
                              }
                            })
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
        }
      </div>
      {
        showParticipantType === false
          ?
          dump = null
          :
          showParticipantType === "student" ?
            <div className="participant-background page-center" id="close-container" onClick={closeParticipant}>
              <div className="participant-container container page-center ">
                <div className="close-button" id="close-holder" onClick={closeParticipant}>
                  <i id="close-icon" className="button fas fa-times fa-2x"></i>
                </div>
                <Error text={error.showParticipant ? error.showParticipant : ""} class="error-text error-view-participants" />
                <div className="participant-details row">
                  <div className="participant-content">
                    <div className="image-div">
                      <img className="participant-image" src={compressedImage ? compressedImage : "./images/profile.png"} alt="imageLogo" />
                      <input type="file" className="participant-file" name="imageParticipantUpload" onChange={compressImage} id="imageParticipantUpload" accept=".jpg" />
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Register number :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentRegisterNumber}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Name :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentName}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">MailID :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentMailId}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Date of Birth :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentDOB}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Phone Number :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentPhoneNumber}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Department :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.studentDepartment}</p>
                      </div>
                    </div>
                    <div className="button-wrapper">
                      <div className="button" onClick={deleteParticipant}>
                        <p className="">Delete</p>
                      </div>
                      {enableUpdate ?
                        <div className="button" onClick={updateImage}>
                          <p className="">Update</p>
                        </div>
                        :
                        dump = null
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="participant-background page-center" id="close-container" onClick={closeParticipant}>
              <div className="participant-container container page-center ">
                <div className="close-button" id="close-holder" onClick={closeParticipant}>
                  <i id="close-icon" className="button fas fa-times fa-2x"></i>
                </div>
                <Error text={error.showParticipant ? error.showParticipant : ""} className="error-text error-view-participants" />
                <div className="participant-details row">
                  <div className="participant-content">
                    <div className="image-div">
                      <img className="participant-image" src={compressedImage ? compressedImage : "./images/profile.png"} alt="imageLogo" />
                      <input type="file" className="participant-file" name="imageParticipantUpload" onChange={compressImage} id="imageParticipantUpload" accept=".jpg" />
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">TeacherID :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.teacherRegisterID}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Teacher Name :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.teacherRegisterName}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Teacher MailID :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.teacherMailID}</p>
                      </div>
                    </div>
                    <div className="lable-container row">
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p className="lable-text">Teacher Department :</p>
                      </div>
                      <div className="show-participant-lable col col-lg-6 col-md-6 col-sm-6 col-6">
                        <p>{showParticipantDetails.teacherDepartment}</p>
                      </div>
                    </div>
                    <div className="button-wrapper">
                      <div className="button" onClick={deleteParticipant}>
                        <p className="">Delete</p>
                      </div>
                      {enableUpdate ?
                        <div className="button" onClick={updateImage}>
                          <p className="">Update</p>
                        </div>
                        :
                        dump = null
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
      }
      {
        spinner ? <Loading /> : ""
      }
    </div>
  )
}
export default ViewParticipants