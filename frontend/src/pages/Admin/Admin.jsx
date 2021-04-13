import react, { useEffect, useState } from "react"
import imageCompression from 'browser-image-compression';
import Error from "../../components/Error"
import Axios from "axios";
import Loading from "../../components/Loading"
import AddParticipants from "./AddParticipants"
import ViewParticipants from "./ViewParticipants";
import CreateTest from "./CreateText"
import ViewSaved from "./AdminViewSaved"
function Admin() {
  const [spinner, setSpinner] = useState(false)
  const menuInitial = "1"
  const [menu, setMenu] = useState(menuInitial)
  const [token, setToken] = useState(false)

  useEffect(() => {
    var tokenGet = JSON.parse(localStorage.getItem("UserData"))
    setToken(tokenGet.jwt)
  }, [])
  function changeMenu(e) {
    var target = e.target.id.split("-")[2]
    if (target === "1") {
      setSpinner(true)
      setMenu("1")
      setSpinner(false)
    } else if (target === "2") {
      setSpinner(true)
      setMenu("2")
      setSpinner(false)
    } else if (target === "3") {
      setSpinner(true)
      setMenu("3")
      setSpinner(false)
    } else {
      setSpinner(true)
      setMenu("4")
      setSpinner(false)
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
            <AddParticipants token={token} />
            : menu === "2" ?
              <ViewParticipants token={token} />
              : menu === "3" ?
                <CreateTest token={token} />
                :
                <ViewSaved token={token} />
        }
        {
          spinner ? <Loading /> : ""
        }
      </div>

    </div>
  )
}

export default Admin;