import react, { useState, useEffect } from "react"
import Axios from "axios"
import Button from "./Button"
import Input from "./Input"
import Error from "./Error"
function AdminLogin() {
  const [error, setError] = useState("")
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
          setError("")
          document.cookie(res.data)
        }
      })
      .catch(err => console.log(err))
  }
  return (
    <div className="form-page">
      <form className="form page-center">
        <Error text={error} class="error-text" />
        <Input id="userName" for="userName" lableText="Username" class="form-input form__field" placeholder="User Name" name="userName" type="text" autofocus="true" />
        <Input id="password" for="password" lableText="password" class="form-input form__field" placeholder="Password" name="password" type="password" autofocus="false" />
        <Button text="Login" class="btn" onclick={logIn} />
      </form>
    </div>
  )
}
export default AdminLogin