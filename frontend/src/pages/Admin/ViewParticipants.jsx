import react, { useState, useEffect } from "react"
import Axios from "axios"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
function ViewParticipants(props) {
  const errorInitial = { database: false }
  const studentDataInitial = {
    studentRegisterNumber: null,
    studentDepartment: null,
    studentYear: null,
    studentBatch: null
  }
  const [spinner, setSpinner] = useState(false)
  const [studentData, setStudentData] = useState([])
  const [displayBatch, setDisplayBatch] = useState([])
  const [displayDepartment, setDisplayDepartment] = useState([])
  const [teacherData, setTeacherData] = useState([])
  const [displayTeacherDepartment, setDisplayTeacherDepartment] = useState([])
  const [error, setError] = useState(errorInitial)
  const [displayStudentYear, setDisplayStudentYear] = useState([])
  useEffect(() => {
    setSpinner(true)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .get("/getparticipants", {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        console.log(res.data)
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
          document.getElementById(e.target.id + "-" + element.studentRegisterNumber + "-student").classList = ["student-container"]
        }
      })
    } else {
      document.getElementById(e.target.id).classList = ["year-plus-img"]
      var id = e.target.id.split("-")
      studentData.map(element => {
        if ((id[0] === element.studentBatch) && (id[1] === element.studentDepartment) && (id[2] === element.studentYear)) {
          document.getElementById(e.target.id + "-" + element.studentRegisterNumber + "-student").classList = ["student-container-none"]
        }
      })
    }
  }
  console.log(displayBatch, displayDepartment, displayTeacherDepartment, displayStudentYear)
  return (
    <div className="viewParticipants">
      <Error text={error.database ? error.database : ""} class="error-text"></Error>
      <div className="container">
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
                                    <div className="student-wrapper">
                                      {
                                        studentData.map(student => {
                                          if ((student.studentBatch === batch) && (student.studentDepartment === department) && (student.studentYear === year)) {
                                            return (
                                              <div className="student-container-none" id={batch + "-" + department + "-" + year + "-" + student.studentRegisterNumber + "-student"}>
                                                <div className="student-holder">
                                                  <h4 className="student-text">{student.studentRegisterNumber}</h4>
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
      </div>
      {
        spinner ? <Loading /> : ""
      }
    </div>
  )
}
export default ViewParticipants