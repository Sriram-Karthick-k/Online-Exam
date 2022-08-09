import react, { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import Peer from "simple-peer"
import Loading from "../../components/Loading"
import Calculator from "../../components/Calculator"
import Error from "../../components/Error"
import Axios from "axios"
import { json } from "mathjs"
function StudentTestPage(props) {
  const errorInitial = { database: false }
  const [error, setError] = useState(errorInitial)
  const [roomDetails, setRoomDetails] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [calculator, setCalculator] = useState(false)
  const [time, setTime] = useState(false)
  const [testButton, setTestButton] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [questionMenu, setQuestionMenu] = useState("1")
  const [questions, setQuestions] = useState(false)
  const [oneMarkIndex, setOneMarkIndex] = useState(0)
  const [twoMarkIndex, setTwoMarkIndex] = useState(0)
  const [answerOneMark, setAnswerOneMark] = useState([])
  const [answerTwoMark, setAnswerTwoMark] = useState([])
  const [fontSize, setFontSize] = useState("question-container big-font")
  const socket = useRef()
  var connectionRef = useRef()

  useEffect(() => {
    const promise = new Promise((res, fail) => {
      var room = JSON.parse(localStorage.getItem("roomDetails"))
      var answer = JSON.parse(localStorage.getItem("answers"))
      if (answer && (room.examName == answer.examName)) {
        console.log(room.registerNumber, answer.roomNumber)
        if (answer.roomNumber == room.registerNumber) {
          if (answer.oneMark) {
            setAnswerOneMark(answer.oneMark)
          }
          if (answer.twoMark) {
            setAnswerTwoMark(answer.twoMark)
          }
        }
      } else {
        localStorage.setItem("answers", false)
      }

      if (room) {
        res(room)
      } else {
        fail("failed")
      }
    })
    promise.then((res) => {
      setRoomDetails(res)
      var room = res
      const beforeTime = setInterval(() => {
        var today = new Date()
        var presentTime = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds()
        setTime(presentTime)
        if (res) {
          if (presentTime >= res.examName.split("-")[res.examName.split("-").length - 2] + ":00") {
            enableTestButton()
            return
          }
        }
      }, 1000);
      function enableTestButton() {
        setTestButton(true)
        clearInterval(beforeTime)
        const afterTestStart = setInterval(() => {
          var today = new Date()
          var presentTime = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds()
          setTime(presentTime)
          if (res) {
            if (presentTime > res.examName.split("-")[res.examName.split("-").length - 1] + ":00") {
              clearInterval(afterTestStart)
              endTest()
              return
            }
          }
        }, 1000);
      }
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
      socket.current.on("share screen", data => {
        shareScreen(room)
      })
      socket.current.on("teacher left", data => {
        console.log("teacher left")
        destroyPeer()
      })
      socket.current.on("end test", data => {
        setError({ database: data.error })
        endTest()
      })
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
      try {
        peer.signal(signal.signal)
        connectionRef.current = peer
      } catch (err) {
        console.log("error");
      }
    })
  }
  function destroyPeer() {
    try {
      connectionRef.current.destroy()
      connectionRef.current = null
    } catch (err) {
      console.log('error');
    }
  }

  function shareScreen(room) {
    var peer = new Peer({
      initiator: true,
      trickle: false,
      stream: props.screenStream
    })
    peer.on("signal", data => {
      socket.current.emit("give screen stream", { roomNumber: room.roomNumber, signalData: data, from: room.registerNumber })
    })
    socket.current.on("screen accepted", signal => {
      try {
        peer.signal(signal.signal)
        connectionRef.current = peer
      } catch (err) {
        console.log("error");
      }
    })
  }

  function startTest() {
    setSpinner(true)
    setTestStarted(true)
    var token = JSON.parse(localStorage.getItem("studentToken"))
    Axios
      .get("/student/getQuestion?examName=" + roomDetails.examName, {
        headers: {
          'Authorization': `token ${token}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setSpinner(false)
          setError({ ...error, database: res.data.error })
        } else {
          setSpinner(false)
          setError(errorInitial)
          setQuestions(res.data)
        }
      })
      .catch(err => console.log(err))
  }
  function changeMenu(e) {
    if (e.target.id.split("-")[2] === "1") {
      setQuestionMenu("1")
    } else {
      setQuestionMenu("2")
    }

  }
  function changeQuestion(e) {
    var id = e.target.id.split("-")
    if (id[0] === "oneMark") {
      var index = oneMarkIndex
      if (answerOneMark.length === 0) {
        var array = new Array(questions.oneMark.length).fill(-1)
        setAnswerOneMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.oneMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            oneMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      }
      if (id[1] === "before") {
        setOneMarkIndex(oneMarkIndex - 1)
      } else {
        setOneMarkIndex(oneMarkIndex + 1)
      }
    } else {
      var index = twoMarkIndex
      if (answerTwoMark.length === 0) {
        var array = new Array(questions.twoMark.length).fill(-1)
        setAnswerTwoMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.twoMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            twoMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      }
      if (id[1] === "before") {
        setTwoMarkIndex(twoMarkIndex - 1)
      } else {
        setTwoMarkIndex(twoMarkIndex + 1)
      }
    }
  }
  function updateAnswer(e) {
    if (questionMenu === "1") {
      if (answerOneMark.length === 0) {
        var array = new Array(questions.oneMark.length).fill(-1)
        array[oneMarkIndex] = {
          questionNumber: questions.oneMark[oneMarkIndex].questionNumber,
          option: e.target.id
        }
        setAnswerOneMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.oneMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            oneMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      } else {
        var array = answerOneMark
        array[oneMarkIndex] = {
          questionNumber: questions.oneMark[oneMarkIndex].questionNumber,
          option: e.target.id
        }
        setAnswerOneMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.oneMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            oneMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      }
    } else {
      if (answerTwoMark.length === 0) {
        var array = new Array(questions.twoMark.length).fill(-1)
        array[twoMarkIndex] = {
          questionNumber: questions.twoMark[twoMarkIndex].questionNumber,
          option: e.target.id
        }
        setAnswerTwoMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.twoMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            twoMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      } else {
        var array = answerTwoMark
        array[twoMarkIndex] = {
          questionNumber: questions.twoMark[twoMarkIndex].questionNumber,
          option: e.target.id
        }
        setAnswerTwoMark(array)
        var getItemLocalStorage = JSON.parse(localStorage.getItem("answers"))
        if (getItemLocalStorage && getItemLocalStorage.examName === roomDetails.examName) {
          getItemLocalStorage.twoMark = array
          localStorage.setItem("answers", JSON.stringify(getItemLocalStorage))
        } else {
          var setItemLocalStorage = {
            roomNumber: roomDetails.registerNumber,
            examName: roomDetails.examName,
            twoMark: array
          }
          localStorage.setItem("answers", JSON.stringify(setItemLocalStorage))
        }
      }
    }
  }
  function changeFont(e) {
    var id = e.target.id
    if (id === "big") {
      setFontSize("question-container big-font")
    } else {
      setFontSize("question-container small-font")
    }
  }
  function changeQuestionTo(e) {
    console.log(e.target.id);
    if (questionMenu === "1") {
      setOneMarkIndex(Number(e.target.id))
    } else {
      setTwoMarkIndex(Number(e.target.id))
    }
  }
  function openCalculator() {
    if (calculator) {
      setCalculator(false)
    } else {
      setCalculator(true)
    }
  }
  function endTest() {
    setSpinner(true)
    var answer = JSON.parse(localStorage.getItem("answers"))
    if (answer) {
      var oneMark = answer.oneMark
      var twoMark = answer.twoMark
    } else {
      var oneMark = false
      var twoMark = false
    }
    var token = JSON.parse(localStorage.getItem("studentToken"))
    var roomDetails = JSON.parse(localStorage.getItem("roomDetails"))
    Axios.post("/student/submit/answer", { registerNumber: roomDetails.registerNumber, examName: roomDetails.examName, oneMark: oneMark, twoMark: twoMark }, {
      headers: {
        'Authorization': `token ${token}`
      }
    })
      .then(res => {
        if (res.data.error) {
          console.log(res.data);
          setError({ ...error, database: res.data.error })
          setSpinner(false)
          setTestButton(true)
        }
        if (res.data.success) {
          setSpinner(false)
          setTestButton(false)
          setError({ ...error, database: res.data.success })
          setSpinner(true)
          setTimeout(() => {
            localStorage.clear()
            window.location = "/student"
          }, 5000);
        }
      })
      .catch(err => { console.log(err) })
  }
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
              <p className="details-text">Register Number : {roomDetails.registerNumber}</p>
              <p className="details-text">Subject Name : {roomDetails.examName.split("-")[roomDetails.examName.split("-").length - 3]}</p>
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

            <div className="tool" onClick={openCalculator}>
              <i class="fas fa-calculator fa-2x"></i>
            </div>
            <div className="tool" >
              <i class="fas fa-font fa-2x" id="big" onClick={changeFont}></i>
            </div>
            <div className="tool" >
              <i class="fas fa-font" id="small" onClick={changeFont}></i>
            </div>
          </div>
          {
            error.database ?
              <Error text={error.database} class="error-text" />
              : ""
          }
          {
            testStarted
              ?
              <div className="container question">
                <div className="menu-padding">
                  <div className="row menu text-center">
                    <div id="question-item-1" onClick={changeMenu} className={questionMenu === "1" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
                      <p id="question-p-1">One mark</p>
                    </div>
                    <div id="question-item-2" onClick={changeMenu} className={questionMenu === "2" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
                      <p id="question-p-2" >Two mark</p>
                    </div>
                  </div>
                </div>
                {
                  questionMenu === "1" ?
                    questions.oneMark ?
                      <div className="header">
                        {
                          oneMarkIndex !== 0 ?
                            <div className="before"  >
                              <i className="fas fa-arrow-circle-left fa-2x" id="oneMark-before" onClick={changeQuestion}></i>
                            </div>
                            :
                            <div className="before">
                            </div>
                        }
                        <div className="questionNumber">
                          <h3>Question no : {oneMarkIndex + 1}</h3>
                        </div>
                        {
                          oneMarkIndex !== (questions.oneMark.length - 1) ?
                            <div className="after" >
                              <i className="fas fa-arrow-circle-right fa-2x" id="oneMark-after" onClick={changeQuestion}></i>
                            </div>
                            :
                            <div className="after">
                            </div>
                        }
                      </div>
                      :
                      <div className="header">
                        <h3>No One Mark questions</h3>
                      </div>
                    :
                    questions.twoMark ?
                      <div className="header">
                        {
                          twoMarkIndex !== 0 ?
                            <div className="before" >
                              <i className="fas fa-arrow-circle-left fa-2x" id="twoMark-before" onClick={changeQuestion}></i>
                            </div>
                            :
                            <div className="before">
                            </div>
                        }
                        <div className="questionNumber">
                          <h3>Question no : {twoMarkIndex + 1}</h3>
                        </div>
                        {
                          twoMarkIndex !== (questions.twoMark.length - 1) ?
                            <div className="after" >
                              <i className="fas fa-arrow-circle-right fa-2x" id="twoMark-after" onClick={changeQuestion}></i>
                            </div>
                            :
                            <div className="after">
                            </div>
                        }
                      </div>
                      :
                      <div className="header">
                        <h3>No Two Mark questions</h3>
                      </div>
                }
                <div className="total-question-container">
                  {
                    questionMenu === "1"
                      ?
                      questions.oneMark ?
                        questions.oneMark.map((elem, index) => {
                          return (
                            index === oneMarkIndex ?
                              <div className={fontSize}>
                                <div className="question-holder">
                                  <p>{questions.oneMark[oneMarkIndex].question}</p>
                                </div>
                                {
                                  answerOneMark.length !== 0 ?
                                    answerOneMark[oneMarkIndex] !== -1 ?

                                      answerOneMark[oneMarkIndex].option === "oneMark-option-A" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-A"} checked name="option" value={questions.oneMark[oneMarkIndex].optionA} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-A"}>{questions.oneMark[oneMarkIndex].optionA}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-A"} name="option" value={questions.oneMark[oneMarkIndex].optionA} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-A"}>{questions.oneMark[oneMarkIndex].optionA}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"oneMark-option-A"} name="option" value={questions.oneMark[oneMarkIndex].optionA} onChange={updateAnswer} />
                                        <label htmlFor={"oneMark-option-A"}>{questions.oneMark[oneMarkIndex].optionA}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"oneMark-option-A"} name="option" value={questions.oneMark[oneMarkIndex].optionA} onChange={updateAnswer} />
                                      <label htmlFor={"oneMark-option-A"}>{questions.oneMark[oneMarkIndex].optionA}</label>
                                    </div>
                                }
                                {
                                  answerOneMark.length !== 0 ?
                                    answerOneMark[oneMarkIndex] !== -1 ?
                                      answerOneMark[oneMarkIndex].option === "oneMark-option-B" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-B"} checked name="option" value={questions.oneMark[oneMarkIndex].optionB} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-B"}>{questions.oneMark[oneMarkIndex].optionB}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-B"} name="option" value={questions.oneMark[oneMarkIndex].optionB} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-B"}>{questions.oneMark[oneMarkIndex].optionB}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"oneMark-option-B"} name="option" value={questions.oneMark[oneMarkIndex].optionB} onChange={updateAnswer} />
                                        <label htmlFor={"oneMark-option-B"}>{questions.oneMark[oneMarkIndex].optionB}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"oneMark-option-B"} name="option" value={questions.oneMark[oneMarkIndex].optionB} onChange={updateAnswer} />
                                      <label htmlFor={"oneMark-option-B"}>{questions.oneMark[oneMarkIndex].optionB}</label>
                                    </div>
                                }
                                {
                                  answerOneMark.length !== 0 ?
                                    answerOneMark[oneMarkIndex] !== -1 ?
                                      answerOneMark[oneMarkIndex].option === "oneMark-option-C" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-C"} checked name="option" value={questions.oneMark[oneMarkIndex].optionC} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-C"}>{questions.oneMark[oneMarkIndex].optionC}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-C"} name="option" value={questions.oneMark[oneMarkIndex].optionC} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-C"}>{questions.oneMark[oneMarkIndex].optionC}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"oneMark-option-C"} name="option" value={questions.oneMark[oneMarkIndex].optionC} onChange={updateAnswer} />
                                        <label htmlFor={"oneMark-option-C"}>{questions.oneMark[oneMarkIndex].optionC}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"oneMark-option-C"} name="option" value={questions.oneMark[oneMarkIndex].optionC} onChange={updateAnswer} />
                                      <label htmlFor={"oneMark-option-C"}>{questions.oneMark[oneMarkIndex].optionC}</label>
                                    </div>
                                }
                                {
                                  answerOneMark.length !== 0 ?
                                    answerOneMark[oneMarkIndex] !== -1 ?
                                      answerOneMark[oneMarkIndex].option === "oneMark-option-D" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-D"} checked name="option" value={questions.oneMark[oneMarkIndex].optionD} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-D"}>{questions.oneMark[oneMarkIndex].optionD}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"oneMark-option-D"} name="option" value={questions.oneMark[oneMarkIndex].optionD} onChange={updateAnswer} />
                                          <label htmlFor={"oneMark-option-D"}>{questions.oneMark[oneMarkIndex].optionD}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"oneMark-option-D"} name="option" value={questions.oneMark[oneMarkIndex].optionD} onChange={updateAnswer} />
                                        <label htmlFor={"oneMark-option-D"}>{questions.oneMark[oneMarkIndex].optionD}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"oneMark-option-D"} name="option" value={questions.oneMark[oneMarkIndex].optionD} onChange={updateAnswer} />
                                      <label htmlFor={"oneMark-option-D"}>{questions.oneMark[oneMarkIndex].optionD}</label>
                                    </div>
                                }
                              </div>
                              :
                              ""
                          )
                        })
                        :
                        ""
                      :
                      questions.twoMark ?
                        questions.twoMark.map((elem, index) => {
                          return (
                            index === twoMarkIndex ?
                              <div className={fontSize}>
                                <div className="question-holder">
                                  <p>{questions.twoMark[twoMarkIndex].question}</p>
                                </div>
                                {
                                  answerTwoMark.length !== 0 ?
                                    answerTwoMark[twoMarkIndex] !== -1 ?

                                      answerTwoMark[twoMarkIndex].option === "twoMark-option-A" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-A"} checked name="option" value={questions.twoMark[twoMarkIndex].optionA} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-A"}>{questions.twoMark[twoMarkIndex].optionA}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-A"} name="option" value={questions.twoMark[twoMarkIndex].optionA} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-A"}>{questions.twoMark[twoMarkIndex].optionA}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"twoMark-option-A"} name="option" value={questions.twoMark[twoMarkIndex].optionA} onChange={updateAnswer} />
                                        <label htmlFor={"twoMark-option-A"}>{questions.twoMark[twoMarkIndex].optionA}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"twoMark-option-A"} name="option" value={questions.twoMark[twoMarkIndex].optionA} onChange={updateAnswer} />
                                      <label htmlFor={"twoMark-option-A"}>{questions.twoMark[twoMarkIndex].optionA}</label>
                                    </div>
                                }
                                {
                                  answerTwoMark.length !== 0 ?
                                    answerTwoMark[twoMarkIndex] !== -1 ?
                                      answerTwoMark[twoMarkIndex].option === "twoMark-option-B" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-B"} checked name="option" value={questions.twoMark[twoMarkIndex].optionB} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-B"}>{questions.twoMark[twoMarkIndex].optionB}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-B"} name="option" value={questions.twoMark[twoMarkIndex].optionB} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-B"}>{questions.twoMark[twoMarkIndex].optionB}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"twoMark-option-B"} name="option" value={questions.twoMark[twoMarkIndex].optionB} onChange={updateAnswer} />
                                        <label htmlFor={"twoMark-option-B"}>{questions.twoMark[twoMarkIndex].optionB}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"twoMark-option-B"} name="option" value={questions.twoMark[twoMarkIndex].optionB} onChange={updateAnswer} />
                                      <label htmlFor={"twoMark-option-B"}>{questions.twoMark[twoMarkIndex].optionB}</label>
                                    </div>
                                }
                                {
                                  answerTwoMark.length !== 0 ?
                                    answerTwoMark[twoMarkIndex] !== -1 ?
                                      answerTwoMark[twoMarkIndex].option === "twoMark-option-C" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-C"} checked name="option" value={questions.twoMark[twoMarkIndex].optionC} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-C"}>{questions.twoMark[twoMarkIndex].optionC}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-C"} name="option" value={questions.twoMark[twoMarkIndex].optionC} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-C"}>{questions.twoMark[twoMarkIndex].optionC}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"twoMark-option-C"} name="option" value={questions.twoMark[twoMarkIndex].optionC} onChange={updateAnswer} />
                                        <label htmlFor={"twoMark-option-C"}>{questions.twoMark[twoMarkIndex].optionC}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"twoMark-option-C"} name="option" value={questions.twoMark[twoMarkIndex].optionC} onChange={updateAnswer} />
                                      <label htmlFor={"twoMark-option-C"}>{questions.twoMark[twoMarkIndex].optionC}</label>
                                    </div>
                                }
                                {
                                  answerTwoMark.length !== 0 ?
                                    answerTwoMark[twoMarkIndex] !== -1 ?
                                      answerTwoMark[twoMarkIndex].option === "twoMark-option-D" ?
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-D"} checked name="option" value={questions.twoMark[twoMarkIndex].optionD} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-D"}>{questions.twoMark[twoMarkIndex].optionD}</label>
                                        </div>
                                        :
                                        <div className="option-holder">
                                          <input type="radio" id={"twoMark-option-D"} name="option" value={questions.twoMark[twoMarkIndex].optionD} onChange={updateAnswer} />
                                          <label htmlFor={"twoMark-option-D"}>{questions.twoMark[twoMarkIndex].optionD}</label>
                                        </div>
                                      :
                                      <div className="option-holder">
                                        <input type="radio" id={"twoMark-option-D"} name="option" value={questions.twoMark[twoMarkIndex].optionD} onChange={updateAnswer} />
                                        <label htmlFor={"twoMark-option-D"}>{questions.twoMark[twoMarkIndex].optionD}</label>
                                      </div>
                                    :
                                    <div className="option-holder">
                                      <input type="radio" id={"twoMark-option-D"} name="option" value={questions.twoMark[twoMarkIndex].optionD} onChange={updateAnswer} />
                                      <label htmlFor={"twoMark-option-D"}>{questions.twoMark[twoMarkIndex].optionD}</label>
                                    </div>
                                }
                              </div>
                              :
                              ""
                          )
                        })
                        : ""
                  }
                </div>
                {
                  questions.twoMark ?
                    (twoMarkIndex === (questions.twoMark.length - 1)) && (questionMenu === "2") ?
                      <div className="end-test" onClick={endTest}>
                        End Test
                    </div>
                      :
                      ""
                    : ""
                }
                <div className="question-number-container">
                  {
                    questionMenu === "1" ?
                      <div className="question-number-wrapper">
                        <div className="row number-container">
                          {
                            questions.oneMark ?
                              questions.oneMark.map((elem, index) => {
                                return (
                                  <div className={oneMarkIndex === index ? "number number-active col col-lg-2 col-sm-2 col-md-2 col-2" : "number col col-lg-2 col-sm-2 col-md-2 col-2"} id={index} onClick={changeQuestionTo}>
                                    {elem.questionNumber}
                                  </div>
                                )
                              })
                              :
                              ""
                          }
                        </div>
                      </div>
                      :
                      <div className="question-number-wrapper">

                        <div className="row number-container">
                          {
                            questions.twoMark ?
                              questions.twoMark.map((elem, index) => {
                                return (
                                  <div className={twoMarkIndex === index ? "number number-active col col-lg-2 col-sm-2 col-md-2 col-2" : "number col col-lg-2 col-sm-2 col-md-2 col-2"} id={index} onClick={changeQuestionTo}>
                                    {elem.questionNumber}
                                  </div>
                                )
                              })
                              :
                              ""
                          }
                        </div>
                      </div>
                  }
                </div>
              </div>
              :
              <div className="container rules-container">
                <h1 className="heading-text">rules</h1>
                <div className="rules">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
                {
                  testButton ?
                    <div onClick={startTest} className="button">
                      <p>Start test</p>
                    </div>
                    :
                    <div className="time-error">
                      <p>Start test button will appear when the exam time starts</p>
                    </div>
                }

              </div>
          }
        </div>
      </div>
      {
        spinner ? <Loading></Loading> : ""
      }
    </div>
  )
}
export default StudentTestPage