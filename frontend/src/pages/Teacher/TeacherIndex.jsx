import react, { useState, useRef, useEffect } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
function TeacherIndex() {
  var [roomDetails, setRoomDetails] = useState(false)
  var socket = useRef()
  var [videoStream, setVideoStream] = useState(false)
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
  function logOut() {
    // localStorage.removeItem("teacherRoomDetails")
    window.location = "/t"
  }
  function endStudentTest(e) {
    var registerNumber = e.target.id.split("-")[1]
    socket.current.emit("end student test", registerNumber)
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
                  <div className="video-holder col col-lg-3 col-md-6 col-sm-12 col-12" id={"video-div" + number}>
                    <div key={number} className="video-container">
                      <video className="video-stream" playsInline id={"video-stream" + number} autoPlay />
                      <div className="chat page-center">
                        <div className="icon-container">
                          <div className="button page-center" id={"endTest-" + number} onClick={endStudentTest}>
                            End Test
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
          </div>
          : ""
      }
    </div>
  )
}
export default TeacherIndex