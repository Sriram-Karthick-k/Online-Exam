import react, { useState } from "react";
import Axios from "axios";
import Loading from "../../components/Loading"
function Protected(props) {
  const [Auth, setAuth] = useState(false);
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
  console.log(Auth)
  return Auth ? <props.component /> : <Loading />

}
export default Protected;
