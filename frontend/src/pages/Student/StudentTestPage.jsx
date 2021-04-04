import react, { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
function StudentTestPage(props) {
  const [roomDetails, setRoomDetails] = useState(false)
  const socket = useRef()
  useEffect(() => {
    var videDiv = document.getElementById("videoSource")
    videDiv.srcObject = props.videoStream
    var videDiv1 = document.getElementById("videoSource1")
    videDiv1.srcObject = props.screenStream
    var room = JSON.parse(localStorage.getItem("roomDetails"))
    setRoomDetails(room)
    socket.current = io.connect()
    socket.current.emit("join student room", room)
    connectToRoom(room)
  }, [])
  function connectToRoom(room) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: props.videoStream
    })
    peer.on("signal", (data) => {
      socket.current.emit("connect to room", room)
    })
  }
  console.log(props.videoStream)
  return (
    <div className="video">
      <video playsInline muted id="videoSource" autoPlay style={{ width: "200px" }} />
      <video playsInline muted id="videoSource1" autoPlay style={{ width: "200px" }} />

    </div>
  )
}
export default StudentTestPage