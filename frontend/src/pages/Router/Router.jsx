import React, { useEffect } from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Student from "../Student"
import Teachers from "../Teachers"
import Admin from "../Admin"
import Notfound from "../Notfound"
import Index from "../Index"
function Routes() {

  return (
    <Router >
      <Switch >
        <Route exact path="/student" ><Student /></Route>
        <Route exact path="/teachers" ><Teachers /></Route>
        {/* <Route exact path="/" ><></Route> */}
        <Route exact path="/admin" ><Admin /></Route>
        <Route exact path="/" ><Index /></Route>
        <Route component={Notfound} />
      </Switch >
    </Router>
  )
}
export default Routes