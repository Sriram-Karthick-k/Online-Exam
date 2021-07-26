import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import AdminLogin from "../Admin/AdminLogin"
import Admin from "../Admin/Admin";
import Student from "../Student/Student"
import Teachers from "../Teacher/Teacher"
import Notfound from "../Notfound"
import Index from "../Index"
import Protected from "./Protected";
function Routes() {
  return (
    <Router >
      <Switch >
        <Route exact path="/student" ><Student /></Route>
        <Route exact path="/teacher" ><Teachers /></Route>
        <Route exact path="/admin/login" ><AdminLogin /></Route>
        <Route exact path="/admin" ><Protected component={Admin} /></Route>
        <Route exact path="/" > <Redirect to="/student" /> </Route>
        <Route component={Notfound} />
      </Switch >
    </Router>
  )
}
export default Routes