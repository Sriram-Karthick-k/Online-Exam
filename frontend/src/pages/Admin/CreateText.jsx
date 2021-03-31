import react, { useState, useEffect } from "react"
import Error from "../../components/Error"
import Axios from "axios"
import Loading from "../../components/Loading"
function CreateText() {
  const [spinner, setSpinner] = useState(false)
  const errorInitital = { database: false, oneMark: false, twoMark: false, showDetails: false }
  const [error, setError] = useState(errorInitital)
  const [createTest, setcreateTest] = useState("1")
  const [details, setDetails] = useState(false)
  const [testDetails, setTestDetails] = useState(false)
  const [examDetails, setExamDetails] = useState(false)
  const [showExamDetails, setShowExamDetails] = useState(false)
  useEffect(() => {
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .get("/getParticipantsYearDepartmentBatch", {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError({ ...error, database: res.data.error })
        } else {
          setError(errorInitital)
          setDetails(res.data)
        }
      })

  }, [])
  function createTestMenu(e) {
    var id = e.target.id.split("-")[2]
    if (id === "1") {
      setcreateTest("1")
      setTestDetails(false)
      setError(errorInitital)
    } else {
      setcreateTest("2")
      getExamDetails()
      setTestDetails(false)
      setError(errorInitital)
    }
  }
  function getExamDetails() {
    setSpinner(true)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .get("/getExamDetails", {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError({ ...error, database: res.data.error })
        } else {
          setExamDetails(res.data)
          setSpinner(false)
        }
      })
  }
  function createInput() {
    var testInfo = {}
    testInfo.subjectName = document.getElementById("subjectName").value
    testInfo.subjectCode = document.getElementById("subjectCode").value
    testInfo.date = document.getElementById("date").value
    testInfo.fromTime = document.getElementById("fromTime").value
    testInfo.toTime = document.getElementById("toTime").value
    testInfo.batch = document.getElementById("Batch").value
    testInfo.year = document.getElementById("year").value
    testInfo.department = document.getElementById("department").value
    testInfo.oneMark = new Array(Number(document.getElementById("noOf1Mark").value)).fill(1)
    testInfo.twoMark = new Array(Number(document.getElementById("noOf2Mark").value)).fill(1)
    if (testInfo.subjectName.length === 0 || testInfo.subjectCode.length === 0 || testInfo.date.length === 0 || testInfo.fromTime.length === 0 || testInfo.toTime.length === 0 || testInfo.batch.length === 0
      || testInfo.year.length === 0 || testInfo.department.length === 0 || testInfo.oneMark.length === 0 || testInfo.twoMark.length === 0) {
      setError({ ...error, database: "All the values should be entered" })
      return
    }
    if (testDetails) {
      var oneMark = []
      var twoMark = []
      for (var i = 0; i < testDetails.oneMark.length; i++) {
        var question = document.getElementById("oneMark-" + (i + 1)).value
        var optionA = document.getElementById("optionAOneMark-" + (i + 1)).value
        var optionB = document.getElementById("optionBOneMark-" + (i + 1)).value
        var optionC = document.getElementById("optionCOneMark-" + (i + 1)).value
        var optionD = document.getElementById("optionDOneMark-" + (i + 1)).value
        var answer = document.getElementById("answerOneMark-" + (i + 1)).value
        var obj = { question: question, optionA: optionA, optionB: optionB, optionC: optionC, optionD: optionD, answer: answer }
        oneMark.push(obj)
      }
      for (var i = 0; i < testDetails.twoMark.length; i++) {
        var question = document.getElementById("twoMark-" + (i + 1)).value
        var optionA = document.getElementById("optionATwoMark-" + (i + 1)).value
        var optionB = document.getElementById("optionBTwoMark-" + (i + 1)).value
        var optionC = document.getElementById("optionCTwoMark-" + (i + 1)).value
        var optionD = document.getElementById("optionDTwoMark-" + (i + 1)).value
        var answer = document.getElementById("answerTwoMark-" + (i + 1)).value
        var obj = { question: question, optionA: optionA, optionB: optionB, optionC: optionC, optionD: optionD, answer: answer }
        twoMark.push(obj)
      }
      setError(errorInitital)
      setTestDetails(testInfo)
      for (var i = 0; i < oneMark.length; i++) {
        document.getElementById("oneMark-" + (i + 1)).value = oneMark[i].question
        document.getElementById("optionAOneMark-" + (i + 1)).value = oneMark[i].optionA
        document.getElementById("optionBOneMark-" + (i + 1)).value = oneMark[i].optionB
        document.getElementById("optionCOneMark-" + (i + 1)).value = oneMark[i].optionC
        document.getElementById("optionDOneMark-" + (i + 1)).value = oneMark[i].optionD
        document.getElementById("answerOneMark-" + (i + 1)).value = oneMark[i].answer
      }
      for (var i = 0; i < twoMark.length; i++) {
        document.getElementById("twoMark-" + (i + 1)).value = twoMark[i].question
        document.getElementById("optionATwoMark-" + (i + 1)).value = twoMark[i].optionA
        document.getElementById("optionBTwoMark-" + (i + 1)).value = twoMark[i].optionB
        document.getElementById("optionCTwoMark-" + (i + 1)).value = twoMark[i].optionC
        document.getElementById("optionDTwoMark-" + (i + 1)).value = twoMark[i].optionD
        document.getElementById("answerTwoMark-" + (i + 1)).value = twoMark[i].answer
      }
      return
    }
    setError(errorInitital)
    setTestDetails(testInfo)
  }
  function createTestQuestion() {
    var testInfo = {}
    testInfo.subjectName = document.getElementById("subjectName").value
    testInfo.subjectCode = document.getElementById("subjectCode").value
    testInfo.date = document.getElementById("date").value
    testInfo.fromTime = document.getElementById("fromTime").value
    testInfo.toTime = document.getElementById("toTime").value
    testInfo.batch = document.getElementById("Batch").value
    testInfo.year = document.getElementById("year").value
    testInfo.department = document.getElementById("department").value
    var oneMark = []
    var twoMark = []
    for (var i = 0; i < testDetails.oneMark.length; i++) {
      var question = document.getElementById("oneMark-" + (i + 1)).value
      var optionA = document.getElementById("optionAOneMark-" + (i + 1)).value
      var optionB = document.getElementById("optionBOneMark-" + (i + 1)).value
      var optionC = document.getElementById("optionCOneMark-" + (i + 1)).value
      var optionD = document.getElementById("optionDOneMark-" + (i + 1)).value
      var answer = document.getElementById("answerOneMark-" + (i + 1)).value
      if (question.length === 0 || optionA.length === 0 || optionB.length === 0 || optionC.length === 0 || optionD.length === 0) {
        setError({ ...error, oneMark: "All the question should be entered." })
        return
      }
      var obj = { question: question, optionA: optionA, optionB: optionB, optionC: optionC, optionD: optionD, answer: answer }
      oneMark.push(obj)
    }
    setError(errorInitital)
    for (var i = 0; i < testDetails.twoMark.length; i++) {
      var question = document.getElementById("twoMark-" + (i + 1)).value
      var optionA = document.getElementById("optionATwoMark-" + (i + 1)).value
      var optionB = document.getElementById("optionBTwoMark-" + (i + 1)).value
      var optionC = document.getElementById("optionCTwoMark-" + (i + 1)).value
      var optionD = document.getElementById("optionDTwoMark-" + (i + 1)).value
      var answer = document.getElementById("answerTwoMark-" + (i + 1)).value
      if (question.length === 0 || optionA.length === 0 || optionB.length === 0 || optionC.length === 0 || optionD.length === 0) {
        setError({ ...error, twoMark: "All the question should be entered." })
        return
      }
      var obj = { question: question, optionA: optionA, optionB: optionB, optionC: optionC, optionD: optionD, answer: answer }
      twoMark.push(obj)
    }
    setError(errorInitital)
    testInfo.oneMark = oneMark
    testInfo.twoMark = twoMark
    setTestDetails(testInfo)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .post("/create-test", testInfo, {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError(errorInitital)
          setError({ ...error, database: res.data.error })
        } else {
          document.getElementById("subjectName").value = ""
          document.getElementById("subjectCode").value = ""
          document.getElementById("date").value = ""
          document.getElementById("fromTime").value = ""
          document.getElementById("toTime").value = ""
          document.getElementById("Batch").value = ""
          document.getElementById("year").value = ""
          document.getElementById("department").value = ""
          document.getElementById("noOf1Mark").value = ""
          document.getElementById("noOf2Mark").value = ""
          setTestDetails(false)
          setError({ ...error, database: res.data.success })
        }
      })
      .catch(err => console.log(err))
  }
  function displayExamQuestions(e) {
    setSpinner(true)
    var elem = e.target.id.split("-")
    var batch = elem[0]
    var department = elem[1]
    var year = elem[2]
    var subjectName = elem[3]
    var date = elem[4] + "-" + elem[5] + "-" + elem[6]
    var fromTime = elem[7]
    var toTime = elem[8]
    var index = null
    for (var i = 0; i < examDetails.length; i++) {
      if (batch === examDetails[i].batch && department === examDetails[i].department && year === examDetails[i].year
        && subjectName === examDetails[i].subjectName && date === examDetails[i].date && fromTime === examDetails[i].fromTime
        && toTime === examDetails[i].toTime) {
        index = i
        break
      }
    }
    setShowExamDetails(examDetails[index])
    setSpinner(false)
  }
  function deleteExam() {
    setSpinner(true)
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios
      .post("/deleteExam", showExamDetails, {
        headers: {
          'Authorization': `token ${token.jwt}`
        }
      })
      .then(res => {
        if (res.data.error) {
          setError(errorInitital)
          setError({ ...error, showDetails: res.data.error })
          return
        }
        setError(errorInitital)
        getExamDetails()
        setError({ ...error, database: res.data.success })
        setShowExamDetails(false)
        setSpinner(false)
      })
  }
  function closeShowExamDetails(e) {
    if (e.target.id.split("-")[0] === "close") {
      setShowExamDetails(false)
      setSpinner(false)
    }
  }
  return (
    <div className="create">
      <Error text={error.database ? error.database : ""} class="create-error-text" />
      <div className="row menu text-center">
        <div id="createTest-item-1" onClick={createTestMenu} className={createTest === "1" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
          <p id="createTest-p-1">Create New Test</p>
        </div>
        <div id="createTest-item-2" onClick={createTestMenu} className={createTest === "2" ? "menu-item col col-lg-6 col-md-6 col-sm-6 col-6 menu-item-active" : "menu-item col col-lg-6 col-md-6 col-sm-6 col-6"}>
          <p id="createTest-p-2" >Edit Created Test</p>
        </div>
      </div>
      {
        createTest === "1" ?
          <div className="create-test row">
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="subjectName">Subject Name :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="text" name="subjectName" id="subjectName" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="subjectCode">Subject Code :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="text" name="subjectCode" id="subjectCode" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="date">Date :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="date" name="date" id="date" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="fromTime">From time :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="time" name="fromTime" id="fromTime" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="toTime">To time :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="time" name="toTime" id="toTime" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="Batch">Batch :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <select id="Batch" className="input">
                {
                  details ?
                    details.batch.map(elem => {
                      return (
                        <option value={elem} className="opt">{elem}</option>
                      )
                    })
                    :
                    ""
                }
              </select>
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="year">Year :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <select id="year" className="input">
                {
                  details ?
                    details.year.map(elem => {
                      return (
                        <option value={elem} className="opt">{elem}</option>
                      )
                    })
                    :
                    ""
                }
              </select>
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="department">Department :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <select id="department" className="input">
                {
                  details ?
                    details.department.map(elem => {
                      return (
                        <option value={elem} className="opt">{elem}</option>
                      )
                    })
                    :
                    ""
                }
              </select>
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="noOf1Mark">No of 1 mark :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="number" name="noOf1Mark" id="noOf1Mark" />
            </div>
            <div className="question-label-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <label className="label" htmlFor="noOf2Mark">No of 2 mark :</label>
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <input className="input" type="number" name="subjectCode" id="noOf2Mark" />
            </div>
            <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
              <button className="button" onClick={createInput}>Create Input</button>
            </div>
            {
              testDetails ?
                <div className="total-question-wrapper container">
                  <div className="question-label col col-lg-12 col-md-12 col-sm-12 col-12">
                    <h1 className="questionMark">One mark</h1>
                  </div>
                  <Error text={error.oneMark ? error.oneMark : ""} class="create-error-text" />
                  <div className="question-wrapper">
                    {
                      testDetails.oneMark.map((elem, index) => {
                        return (
                          <div className="question-container row">
                            <p className="questionNumber">{index + 1}</p>
                            <div className="question col col-lg-11 col-md-11 col-sm-11 col-11">
                              <input className="input" type="text" placeholder={"Question number " + (index + 1)} name={"oneMark-" + (index + 1)} id={"oneMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option A" name="optionA" id={"optionAOneMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option B" name="optionB" id={"optionBOneMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option C" name="optionC" id={"optionCOneMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option D" name="optionD" id={"optionDOneMark-" + (index + 1)} />
                            </div>
                            <div className="label-container col col-lg-6 col-md-6 col-sm-6 col-6">
                              <label className="label" htmlFor={"answerOneMark-" + index}>Answer :</label>
                            </div>
                            <div className="option col col-lg-3 col-md-3 col-sm-3 col-3">
                              <select id={"answerOneMark-" + (index + 1)} className="input">
                                <option value="A" className="opt">A</option>
                                <option value="B" className="opt">B</option>
                                <option value="C" className="opt">C</option>
                                <option value="D" className="opt">D</option>
                                <option value="All" className="opt">All</option>
                              </select>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="question-label col col-lg-12 col-md-12 col-sm-12 col-12">
                    <h1 className="questionMark">Two mark</h1>
                  </div>
                  <Error text={error.twoMark ? error.twoMark : ""} class="create-error-text" />
                  <div className="question-wrapper">
                    {
                      testDetails.twoMark.map((elem, index) => {
                        return (
                          <div className="question-container row">
                            <p className="questionNumber">{index + 1}</p>
                            <div className="question col col-lg-11 col-md-11 col-sm-11 col-11">
                              <input className="input" type="text" placeholder={"Question number " + (index + 1)} name={"twoMark-" + (index + 1)} id={"twoMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option A" name="optionA" id={"optionATwoMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option B" name="optionB" id={"optionBTwoMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option C" name="optionC" id={"optionCTwoMark-" + (index + 1)} />
                            </div>
                            <div className="option col col-lg-3 col-md-12 col-sm-12 col-12">
                              <input className="input" type="text" placeholder="Option D" name="optionD" id={"optionDTwoMark-" + (index + 1)} />
                            </div>
                            <div className="label-container col col-lg-6 col-md-6 col-sm-6 col-6">
                              <label className="label" htmlFor={"answerTwoMark-" + (index + 1)}>Answer :</label>
                            </div>
                            <div className="option col col-lg-3 col-md-3 col-sm-3 col-3">
                              <select id={"answerTwoMark-" + (index + 1)} className="input">
                                <option value="A" className="opt">A</option>
                                <option value="B" className="opt">B</option>
                                <option value="C" className="opt">C</option>
                                <option value="D" className="opt">D</option>
                                <option value="All" className="opt">All</option>
                              </select>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="question-input-container col col-lg-6 col-md-6 col-sm-6 col-6">
                    <button className="button" onClick={createTestQuestion} >Create Test</button>
                  </div>
                </div>
                :
                ""
            }

          </div>
          :

          examDetails ?
            <div className="exam-wrapper row">
              <div className="tag">
                <h3>Completed Exam</h3>
              </div>
              {examDetails.map((elem, index) => {
                var data = new Date()
                var date = data.toISOString().split("T")[0]
                var time = data.getHours() + ":" + data.getMinutes()
                if (date.localeCompare(elem.date) !== 1)
                  if (time.localeCompare(elem.toTime) !== -1) {
                    return (
                      <div className="exam-container col-lg-12 col-sm-12 col-md-12 col-12" onClick={displayExamQuestions} id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examContainer"} key={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examContainer"} >
                        <div className="exam-holder" id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examHolder"}>
                          <p className="exam-text" id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examText"} >{elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime}</p>
                        </div>
                      </div>
                    )
                  }
              })}
              <div className="tag">
                <h3>In Complete Exam</h3>
              </div>
              {examDetails.map((elem, index) => {
                var data = new Date()
                var date = data.toISOString().split("T")[0]
                var time = data.getHours() + ":" + data.getMinutes()
                if (date.localeCompare(elem.date) !== -1)
                  if (time.localeCompare(elem.toTime) !== 1) {
                    return (
                      <div className="exam-container col-lg-12 col-sm-12 col-md-12 col-12" onClick={displayExamQuestions} id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examContainer"} key={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examContainer"} >
                        <div className="exam-holder" id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examHolder"}>
                          <p className="exam-text" id={elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime + "-examText"} >{elem.batch + "-" + elem.department + "-" + elem.year + "-" + elem.subjectName + "-" + elem.date + "-" + elem.fromTime + "-" + elem.toTime}</p>
                        </div>
                      </div>
                    )
                  }
              })}

            </div>
            :
            ""

      }
      {showExamDetails ?
        <div className="exam-question-container page-center" onClick={closeShowExamDetails} id="close-container">
          <div className="exam-question page-center">
            <div className="close-button" id="close-holder" onClick={closeShowExamDetails}>
              <i id="close-icon" className="button fas fa-times fa-2x"></i>
            </div>
            <Error text={error.showDetails ? error.showDetails : ""} class="error-text" />
            <div className="tag">
              <h4>One Mark</h4>
            </div>
            <div className="exam-question-wrapper row">
              {
                showExamDetails.oneMark.map((elem, index) => {
                  return (
                    <div className="question-container row col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="questionHolder col-lg-12 col-sm-12 col-md-12 col-12">
                        <p>{index + 1 + "." + elem.question}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"A." + elem.optionA}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"B." + elem.optionB}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"C." + elem.optionC}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"D." + elem.optionD}</p>
                      </div>
                      <div className="questionOption-answer col-lg-6 col-sm-6 col-md-6 col-6">
                        <p>Answer :</p>
                      </div>
                      <div className="questionOption-answer col-lg-6 col-sm-6 col-md-6 col-6">
                        <p>{elem.answer}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="tag">
              <h4>Two Mark</h4>
            </div>
            <div className="exam-question-wrapper row">
              {
                showExamDetails.twoMark.map((elem, index) => {
                  return (
                    <div className="question-container row col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="questionHolder col-lg-12 col-sm-12 col-md-12 col-12">
                        <p>{index + 1 + "." + elem.question}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"A." + elem.optionA}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"B." + elem.optionB}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"C." + elem.optionC}</p>
                      </div>
                      <div className="questionOption col-lg-3 col-sm-3 col-md-3 col-3">
                        <p>{"D." + elem.optionD}</p>
                      </div>
                      <div className="questionOption-answer col-lg-6 col-sm-6 col-md-6 col-6">
                        <p>Answer :</p>
                      </div>
                      <div className="questionOption-answer col-lg-6 col-sm-6 col-md-6 col-6">
                        <p>{elem.answer}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="button-container col-lg-6 col-md-6 col-sm-6 col-6">
              <button onClick={deleteExam} className="button">Delete</button>
            </div>
          </div>

        </div>
        :
        ""
      }
      {
        spinner ? <Loading /> : ""
      }
    </div>
  )
}
export default CreateText