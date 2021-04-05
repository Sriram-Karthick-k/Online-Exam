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
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(data => {
      setVideoStream(data)
    })
    socket.current = io.connect()
    socket.current.emit("connect to teacher room", room)
    socket.current.on("get video", data => {
      getVideo(data)
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
      var video = document.getElementById("videoSource")
      video.srcObject = stream
    })
    peer.signal(data.signalData)
  }
  return (
    <div>
      <div className="video">
        <video playsInline id="videoSource" autoPlay style={{ width: "300px" }} />
      </div>
    </div>
  )
}
export default TeacherIndex