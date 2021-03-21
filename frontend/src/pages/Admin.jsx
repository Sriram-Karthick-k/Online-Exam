import react, { useEffect, useState } from "react"
import Axios from "axios"
import Input from '../components/Input'
import Button from "../components/Button"
import Error from "../components/Error"
import AdminLogin from "../components/AdminLogin"
function Admin() {
  const [page, setPage] = useState("login")
  document.documentElement.requestFullscreen()
    .catch(err => {
      console.log(err)
    })

  document.onkeydown = function (e) {
    if ((e.keyCode >= 32 && e.keyCode <= 90) || 40) {
      return true
    } else {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  return (
    <div className="admin copy-text">
      <AdminLogin />
    </div>
  )
}
export default Admin