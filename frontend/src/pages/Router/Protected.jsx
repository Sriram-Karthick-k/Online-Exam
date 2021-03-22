import react, { useState } from "react";
import Axios from "axios";
function Protected(props) {
  const [Auth, setAuth] = useState(true);
  var data = JSON.parse(localStorage.getItem("UserData"));
  if (data) {
    Axios.get("/Auth?token=" + data.jwt)
      .then((res) => {
        if (!res.data.loggedIn) {
          localStorage.removeItem("UserData");
          window.location = "/admin-login";
        } else {
          setAuth(true);
        }
      })
      .catch((err) => console.log(err));
  } else {
    window.location = "/admin-login";
  }
  var dump = 1;
  return Auth ? <props.component /> : (dump = "");
}
export default Protected;
