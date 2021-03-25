import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import AdminLogin from "../Admin/AdminLogin"
import Admin from "../Admin/Admin";
import Student from "../Student"
import Teachers from "../Teachers"
import Notfound from "../Notfound"
import Index from "../Index"
import Protected from "./Protected";
function Routes() {
  return (
    <Router >
      <Switch >
        <Route exact path="/student" ><Student /></Route>
        <Route exact path="/teachers" ><Teachers /></Route>
        <Route exact path="/admin-login" ><AdminLogin /></Route>
        <Route exact path="/admin" ><Protected component={Admin} /></Route>
        <Route exact path="/" ><Index /></Route>
        <Route component={Notfound} />
      </Switch >
    </Router>
  )
}
export default Routes