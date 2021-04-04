import react, { useState, useRef, useEffect } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
function TeacherIndex() {
  var [roomDetails, setRoomDetails] = useState(false)
  var socket = useRef()
  var userVideo = useRef()
  useEffect(() => {
    var room = JSON.parse(localStorage.getItem("teacherRoomDetails"))
    setRoomDetails(room)
    socket.current = io.connect()
    socket.current.emit("join teacher room", room)
    socket.current.on("joining room", data => {
      connectToRoom()
    })
  }, [])
  function connectToRoom() {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: null
    })
    peer.on("stream", stream => {
      userVideo.current.srcObject = stream
    })
  }
  return (
    <div>
      <div className="video">
        {<video playsInline muted ref={userVideo} autoPlay style={{ width: "200px" }} />}
      </div>
    </div>
  )
}
export default TeacherIndex