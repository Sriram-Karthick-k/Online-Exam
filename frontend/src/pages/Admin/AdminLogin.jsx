import react, { useState } from "react"
import Axios from "axios"
import Input from '../../components/Input'
import Button from "../../components/Button"
import Error from "../../components/Error"
function Admin() {
  document.onkeydown = function (e) {
    if ((e.keyCode >= 32 && e.keyCode <= 90) || 40) {
      return true
    } else {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }
  const [error, setError] = useState(" ")
  function logIn(e) {
    e.preventDefault()
    var userName = document.getElementById("userName").value
    var password = document.getElementById("password").value
    Axios
      .post("/admin-login", { userName: userName, password: password })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error)
        } else {
          setError(" ")
          localStorage.setItem("UserData", JSON.stringify(res.data))
          window.location = "/admin"
        }
      })
      .catch(err => console.log(err))
  }
  return (
    <div className="admin copy-text">
      <div className="form-page">
        <form className="form page-center">
          <Error text={error} class="error-text text-center" />
          <Input id="userName" for="userName" lableText="Username" class="form-input form__field" placeholder="User Name" name="userName" type="text" autofocus="false" />
          <Input id="password" for="password" lableText="Password" class="form-input form__field" placeholder="Password" name="password" type="password" autofocus="false" />
          <Button text="Login" class="btn" onclick={logIn} />
        </form>
      </div>
    </div>
  )
}
export default Admin