import react, { useState, useRef, useEffect } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
import Loading from "../../components/Loading"
function TeacherIndex() {
  const [spinner, setSpinner] = useState(false)
  var [roomDetails, setRoomDetails] = useState(false)
  var socket = useRef()
  var [videoStream, setVideoStream] = useState(false)
  const screenRef = useRef()
  useEffect(() => {
    var room = JSON.parse(localStorage.getItem("teacherRoomDetails"))
    setRoomDetails(room)
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(data => {
      setVideoStream(data)
    })
    socket.current = io.connect()
    socket.current.emit("connect to teacher room", room)
    socket.current.on("get video", data => {
      getVideo(data)
    })
    socket.current.on("get screen", data => {
      getScreen(data)
    })
    socket.current.on("student left", data => {
      console.log("userleft");
      var videoDiv = document.getElementById("video-div" + data.registerNumber)
      videoDiv.classList = ["video-holder-hidden"]
    })
  }, [])
  function getVideo(data) {
    var peer = new Peer({
      initiator: false,
      trickle: false,
      stream: false
    })
    peer.on("signal", stream => {
      socket.current.emit("got video", { signal: stream, to: data.from })
    })
    peer.on("stream", stream => {
      var videoDiv = document.getElementById("video-div" + data.from)
      videoDiv.classList = ["video-holder col col-lg-3 col-md-6 col-sm-12 col-12"]
      var video = document.getElementById("video-stream" + data.from)
      video.srcObject = stream
    })
    peer.signal(data.signalData)
  }

  function getScreen(data) {
    setSpinner(true)
    var peer = new Peer({
      initiator: false,
      trickle: false,
      stream: false
    })
    peer.on("signal", stream => {
      socket.current.emit("got screen", { signal: stream, to: data.from })
    })
    peer.on("stream", stream => {
      setSpinner(false)
      var videoDiv = document.getElementById("screen-div")
      videoDiv.classList = ["page-center screen-container"]
      var video = document.getElementById("screen-video")
      video.srcObject = stream
    })
    peer.signal(data.signalData)
    screenRef.current = peer
  }

  function logOut() {
    localStorage.removeItem("teacherRoomDetails")
    window.location = "/teacher"
  }
  function endStudentTest(e) {
    var registerNumber = e.target.id.split("-")[1]
    socket.current.emit("end student test", registerNumber)
  }
  function shareScreen(e) {
    socket.current.emit("give screen", { to: e.target.id.split("-")[1] })
  }
  function endShareScreen() {
    screenRef.current.destroy()
    var videoDiv = document.getElementById("screen-div")
    videoDiv.classList = ["page-center screen-container-hidden"]
  }
  return (
    <div>
      {
        roomDetails ?
          <div className="video container" >
            <div className="row details-container">
              <div className="room-details col col-lg-4 col-md-4 col-4 col-sm-4">
                Teacher ID : {roomDetails.teacherId}
              </div>
              <div className="room-details col col-lg-4 col-md-4 col-4 col-sm-4">
                Subject Name : {roomDetails.examName.split("-")[roomDetails.examName.split("-").length - 3]}
              </div>
              <div className="button-container col col-lg-4 col-md-4 col-4 col-sm-4">
                <div className="button" onClick={logOut}>
                  Logout
                </div>
              </div>
            </div>
            <div className="video-wrapper  row">
              {roomDetails.registerNumber.map(number => {
                return (
                  <div className="video-holder-hidden col col-lg-3 col-md-6 col-sm-12 col-12" id={"video-div" + number}>
                    <div key={number} className="video-container">
                      <video className="video-stream" playsInline id={"video-stream" + number} autoPlay />
                      <div className="chat page-center">
                        <div className="icon-container">
                          <div className="button-center">
                            <div className="button" id={"endTest-" + number} onClick={endStudentTest}>
                              End Test
                          </div>
                            <div className="button" id={"shareScreen-" + number} onClick={shareScreen}>
                              Share Screen
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="number">
                      Reg.no : {number}
                    </div>

                  </div>
                )
              })
              }

            </div>
            <div className="page-center screen-container-hidden" id="screen-div">
              <div className="screen-holder page-center">
                <div className="icon-container" onClick={endShareScreen}>
                  <i class="fas fa-times fa-2x"></i>
                </div>
                <video onClick={endShareScreen} className="screen-stream" playsInline id="screen-video" autoPlay />
              </div>
            </div>
          </div>
          : ""
      }
      {
        spinner ? <Loading></Loading> : ""
      }
    </div>
  )
}
export default TeacherIndex