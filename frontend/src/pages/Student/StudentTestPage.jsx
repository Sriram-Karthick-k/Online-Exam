import react, { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
function StudentTestPage(props) {
  const [roomDetails, setRoomDetails] = useState(false)
  const socket = useRef()
  var connectionRef = useRef()
  useEffect(() => {
    var room = JSON.parse(localStorage.getItem("roomDetails"))
    setRoomDetails(room)
    var video = document.getElementById("videoSource")
    video.srcObject = props.videoStream
    socket.current = io.connect()
    socket.current.emit("connect to student room", room)
    socket.current.on("share video", data => {
      shareVideoToRoom(room)
    })
    socket.current.on("share video again", data => {
      shareVideoToRoom(room)
    })
  }, [])
  function shareVideoToRoom(room) {
    var peer = new Peer({
      initiator: true,
      trickle: false,
      stream: props.videoStream
    })
    peer.on("signal", data => {
      socket.current.emit("give video", { roomNumber: room.roomNumber, signalData: data, from: room.registerNumber })
    })
    socket.current.on("video accepted", signal => {
      peer.signal(signal.signal)
    })
  }
  return (
    <div className="video">
      <video playsInline muted id="videoSource" autoPlay style={{ width: "200px" }} />
      <video playsInline muted id="videoSource1" autoPlay style={{ width: "200px" }} />
      <video playsInline muted id="partner" autoPlay style={{ width: "200px" }} />

    </div>
  )
}
export default StudentTestPage