import react, { useState, useEffect, useRef } from "react"

function StudentSetting() {
  const [error, setError] = useState({ audio: false, location: false, video: false, screen: false, idCard: false, faceCapture: false })
  const [location, setLocation] = useState(false)
  const [videoStream, setVideoStream] = useState(false)
  const [screenStream, setScreenStream] = useState(false)
  const myVideo = useRef()
  const myScreen = useRef()
  useEffect(() => {
    checkForAudio()

  }, [])
  function checkForAudio() {
    setError({ ...error, audio: "Checking for microphone..." })
    var audioIcon = document.getElementById("audio-icon")
    audioIcon.classList = ["setting-icon loading-spinner-setting"]
    var audioText = document.getElementById("audio-text")
    navigator.getUserMedia = navigator.getUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true },
        function (stream) {
          setError({ ...error, audio: "Microphone is accessed." })
          audioIcon.classList = ["setting-icon setting-icon-success"]
          audioText.classList = ["setting-text setting-text-success"]
          checkForVideo()
        },
        function (err) {
          audioIcon.classList = ["setting-icon setting-icon-failure"]
          audioText.classList = ["setting-text setting-text-failure"]
          setError({ ...error, audio: "Access denied." })
        }
      );
    } else {
      audioIcon.classList = ["setting-icon setting-icon-failure"]
      audioText.classList = ["setting-text setting-text-failure"]
      setError({ ...error, audio: "Not supported." })
    }
  }
  function checkForVideo() {
    setError({ ...error, audio: "Microphone is accessed", video: "Checking for camera..." })
    var icon = document.getElementById("video-icon")
    icon.classList = ["setting-icon loading-spinner-setting"]
    var text = document.getElementById("video-text")
    navigator.getUserMedia = navigator.getUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true, audio: true },
        function (stream) {
          icon.classList = ["setting-icon setting-icon-success"]
          text.classList = ["setting-text setting-text-success"]
          setError({ ...error, audio: "Microphone is accessed", video: "Camera accessed." })
          setVideoStream(stream)
          getLocation()
        },
        function (err) {
          icon.classList = ["setting-icon setting-icon-failure"]
          text.classList = ["setting-text setting-text-failure"]
          setError({ ...error, audio: "Microphone is accessed", video: "Camera is not accessed." })
          getLocation()
        }
      );
    } else {
      icon.classList = ["setting-icon setting-icon-failure"]
      text.classList = ["setting-text setting-text-failure"]
      setError({ ...error, audio: "Microphone is accessed", video: "Not supported." })
    }
  }
  function getLocation() {
    setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Checking location..." })
    var icon = document.getElementById("location-icon")
    icon.classList = ["setting-icon loading-spinner-setting"]
    var text = document.getElementById("location-text")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed." })
      icon.classList = ["setting-icon setting-icon-success"]
      text.classList = ["setting-text setting-text-success"]
      screenCapture()
    } else {
      icon.classList = ["setting-icon setting-icon-failure"]
      text.classList = ["setting-text setting-text-failure"]
      setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "GPS is not working properly..." })
    }
    function showPosition(position) {
      var location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      setLocation(location)
    }
  }
  function screenCapture() {

  }
  return (
    <div className="setting-up page-center">
      <div className="setting">
        <div className="setting-icon" id="audio-icon">
          <i class="fas fa-microphone fa page-center"></i>
        </div>
        <div className="setting-text" id="audio-text">
          <p>{error.audio ? error.audio : ""}</p>
        </div>
      </div>
      <div className="setting">
        <div className="setting-icon" id="video-icon">
          <i class="fas fa-video fa page-center"></i>
        </div>
        <div className="setting-text" id="video-text">
          <p>{error.video ? error.video : ""}</p>
        </div>
      </div>
      <div className="setting">
        <div className="setting-icon" id="location-icon">
          <i class="fas fa-map-marker fa page-center"></i>
        </div>
        <div className="setting-text" id="location-text">
          <p>{error.location ? error.location : ""}</p>
        </div>
      </div>
      <div className="setting">
        <div className="setting-icon">
          <i class="fas fa-mobile-alt fa page-center"></i>
        </div>
        <div className="setting-text">
          <p>{error.screen ? error.screen : ""}</p>
        </div>
      </div>
      <div className="video">
        {screenStream && <video playsInline muted ref={myScreen} autoPlay style={{ width: "300px" }} />}
      </div>
    </div>
  )
}
export default StudentSetting