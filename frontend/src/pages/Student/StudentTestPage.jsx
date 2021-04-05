import react, { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
import Loading from "../../components/Loading"
import Calculator from "../../components/Calculator"
function StudentTestPage(props) {
  const [roomDetails, setRoomDetails] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [calculator, setCalculator] = useState(false)
  const [time, setTime] = useState(false)
  const socket = useRef()
  var connectionRef = useRef()
  useEffect(() => {
    var room = JSON.parse(localStorage.getItem("roomDetails"))
    setRoomDetails(room)
    // var video = document.getElementById("videoSource")
    // video.srcObject = props.videoStream
    // socket.current = io.connect()
    // socket.current.emit("connect to student room", room)
    // socket.current.on("share video", data => {
    //   shareVideoToRoom(room)
    // })
    // socket.current.on("share video again", data => {
    //   shareVideoToRoom(room)
    // })
    // socket.current.on("teacher left", data => {
    //   console.log("teacher left")
    //   destroyPeer()
    // })
  }, [])
  function shareVideoToRoom(room) {
    // var peer = new Peer({
    //   initiator: true,
    //   trickle: false,
    //   stream: props.videoStream
    // })
    // peer.on("signal", data => {
    //   socket.current.emit("give video", { roomNumber: room.roomNumber, signalData: data, from: room.registerNumber })
    // })
    // socket.current.on("video accepted", signal => {
    //   try {
    //     peer.signal(signal.signal)
    //     connectionRef.current = peer
    //   } catch (err) {
    //     console.log(err);
    //   }
    // })
  }
  function destroyPeer() {
    try {
      connectionRef.current.destroy()
      connectionRef.current = null
    } catch (err) {
      console.log(err);
    }
  }
  setInterval(() => {
    var today = new Date()
    var presentTime = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds()
    setTime(presentTime)
  }, 1000);
  return (
    <div className="test">
      <div className="video">
        <video className="videoSource page-center" playsInline muted id="videoSource" autoPlay />
      </div>
      {calculator ? <Calculator /> : ""}
      <div className="test-container">
        <div className="details-container">
          {roomDetails ?
            <div className="details">
              <p>Register Number : {roomDetails.registerNumber}</p>
              <p>Subject Name : {roomDetails.examName.split("-")[roomDetails.examName.split("-").length - 3]}</p>
            </div>
            :
            ""
          }
        </div>
        <div className="container question-container">
          <div className="clock">
            <p>{time}</p>
          </div>
          <div className="tools">

            <div className="tool">
              <i class="fas fa-calculator fa-2x"></i>
            </div>
            <div className="tool">
              <i class="fas fa-font fa-2x"></i>
            </div>
            <div className="tool">
              <i class="fas fa-font "></i>
            </div>
          </div>
          <div className="test-page-container row">
          </div>
        </div>
      </div>
      {
        spinner ? <Loading></Loading> : ""
      }
    </div>
  )
}
export default StudentTestPage