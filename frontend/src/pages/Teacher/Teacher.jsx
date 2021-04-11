import react, { useState } from "react"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import TeacherIndex from "./TeacherIndex"
import Axios from "axios"
function Teachers() {
  const [error, setError] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  function logIn(e) {
    e.preventDefault()
    var teacherId = document.getElementById("teacherId").value
    var password = document.getElementById("password").value
    if (teacherId.length === 0 && password.length === 0) {
      setError("All values should be entered.")
      return
    }
    setSpinner(true)
    var teacherDetails = {
      teacherId: teacherId,
      password: password
    }
    Axios
      .post("/teacher/login", teacherDetails)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error)
          setSpinner(false)
          return
        }
        if (res.data) {
          localStorage.setItem("teacherRoomDetails", JSON.stringify(res.data))
          setLoggedIn(true)
          setSpinner(false)
        }
      })
      .catch(err => console.log(err))
  }
  return (
    <div className="teacher copy-text">
      <div className="student-page">
        {
          loggedIn ?
            <TeacherIndex />
            :
            <div className="admin copy-text">
              <div className="form-page">
                <form className="form page-center">
                  <Error text={error} class="error-text text-center" />
                  <Input id="teacherId" for="userName" lableText="Teacher id" class="form-input form__field" placeholder="User Name" name="userName" type="text" autofocus="false" />
                  <Input id="password" for="password" lableText="Password" class="form-input form__field" placeholder="Password" name="password" type="password" autofocus="false" />
                  <Button text="Login" class="btn" onclick={logIn} />
                </form>
              </div>
            </div>
        }
        {
          spinner ? <Loading></Loading> : ""
        }
      </div>
    </div>
  )
}
export default Teachers