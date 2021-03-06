import react, { useState, useEffect, useRef } from "react"
import StudentTestPage from "./StudentTestPage"

function StudentSetting() {
  const [error, setError] = useState({ audio: false, location: false, video: false, screen: false })
  const [location, setLocation] = useState(false)
  const [videoStream, setVideoStream] = useState(false)
  const [screenStream, setScreenStream] = useState(false)
  const [next, setNext] = useState(false)
  const [socket, setSocket] = useState(false)
  useEffect(() => {
    setSocket(false)
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
          setVideoStream(stream)
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
          getLocation()
          setError({ ...error, audio: "Microphone is accessed", video: "Camera is not accessed." })
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
      navigator.geolocation.getCurrentPosition(function (position) {
        var locationSet = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        setLocation(locationSet)
        icon.classList = ["setting-icon setting-icon-success"]
        text.classList = ["setting-text setting-text-success"]
        setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed." })
        screenCapture()
      },
        function (error) {
          if (error.code == error.PERMISSION_DENIED) {
            icon.classList = ["setting-icon setting-icon-failure"]
            text.classList = ["setting-text setting-text-failure"]
            setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "GPS access is denied." })
          }
        });
    } else {
      icon.classList = ["setting-icon setting-icon-failure"]
      text.classList = ["setting-text setting-text-failure"]
      setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "GPS is not working properly..." })
    }
  }
  function screenCapture() {
    setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed.", screen: "Waiting for screen capture..." })
    var icon = document.getElementById("screen-icon")
    icon.classList = ["setting-icon loading-spinner-setting"]
    var text = document.getElementById("screen-text")

    var displayMediaOptions = {
      video: {
        cursor: "always"
      },
      audio: false
    };
    async function startCapture(displayMediaOptions) {
      try {
        var screen = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        console.log(screen)
        if (screen) {
          setScreenStream(screen)
          icon.classList = ["setting-icon setting-icon-success"]
          text.classList = ["setting-text setting-text-success"]
          setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed.", screen: "Screen is captured" })
          setNext(true)
        } else {
          icon.classList = ["setting-icon setting-icon-failure"]
          text.classList = ["setting-text setting-text-failure"]
          setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed.", screen: "screen is not shared" })
        }

      } catch (err) {
        icon.classList = ["setting-icon setting-icon-failure"]
        text.classList = ["setting-text setting-text-failure"]
        setNext(true)
        setError({ ...error, audio: "Microphone is accessed.", video: "Camera accessed.", location: "Location is accessed.", screen: "screen is not shared." })
      }
    }
    startCapture(displayMediaOptions)
  }
  function settingDone() {
    setSocket(true)
  }
  return (
    socket ?
      <StudentTestPage videoStream={videoStream} screenStream={screenStream} />
      :
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
          <div className="setting-icon" id="screen-icon">
            <i class="fas fa-mobile-alt fa page-center"></i>
          </div>
          <div className="setting-text" id="screen-text">
            <p>{error.screen ? error.screen : ""}</p>
          </div>
        </div>
        {
          next ?
            <div onClick={settingDone} className="button">
              <p class="">Next</p>
            </div>
            : ""
        }
      </div>
  )
}
export default StudentSetting