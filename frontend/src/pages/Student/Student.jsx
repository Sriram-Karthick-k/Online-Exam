import react, { useState } from "react"
import Input from "../../components/Input"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import Button from "../../components/Button"
import Axios from "axios"
import StudentSetting from "./StudentSetting"
function Student() {
  const [error, setError] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  function logIn(e) {
    e.preventDefault()
    setSpinner(true)
    var studentDetails = {}
    var date = document.getElementById("date").value
    var registerNumber = document.getElementById("userName").value
    var check = document.getElementById("checkbox").checked
    if (!check || date.length === 0 || registerNumber.length === 0) {
      setError("All the values should be entered")
      setSpinner(false)
      return
    }
    setError("")
    studentDetails.registerNumber = registerNumber
    studentDetails.date = date
    Axios
      .post("/student/login", studentDetails)
      .then(res => {
        if (res.data.error) {
          setError(res.data.error)
          setSpinner(false)
          return
        }
        setError("")
        setLoggedIn(true)
        res.data.room.registerNumber = registerNumber
        localStorage.setItem("roomDetails", JSON.stringify(res.data.room))
        localStorage.setItem("studentToken", JSON.stringify(res.data.token))

        setSpinner(false)
      })
  }
  return (
    <div className="student copy-text">
      <div className="student-page">
        {
          loggedIn ?
            <StudentSetting />
            :
            <form className="form page-center">
              <Error text={error} class="error-text text-center" />
              <Input id="userName" for="userName" lableText="Register Number" class="form-input form__field" placeholder="User Name" name="userName" type="text" autofocus="false" />
              <div className="date">
                <label htmlFor="date" className="date-label">Date of Birth :</label>
                <input type="date" name="date" id="date" className="input-date" />
              </div>
              <div className="date">
                <label htmlFor="checkbox" className="date-label">I here by confirm the attendence.</label>
                <input type="checkbox" id="checkbox" className="input-date" name="attendence" value="true" required />
              </div>
              <Button text="Confirm" class="btn" onclick={logIn} />
            </form>
        }
        {
          spinner ? <Loading></Loading> : ""
        }
      </div>
    </div>
  )
}
export default Student