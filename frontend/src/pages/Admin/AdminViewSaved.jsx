import react, { useState, useEffect } from "react"
import Axios from "axios"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function AdminViewSaved(props) {
  const [spinner, setSpinner] = useState(false)
  const errorInitial = { database: false }
  const [error, setError] = useState(errorInitial)
  const [answer, setAnswer] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  useEffect(() => {
    setSpinner(true)
    var promise = new Promise((resolve, fail) => {
      var token = JSON.parse(localStorage.getItem("UserData"))
      if (token) {
        resolve(token)
      } else {
        fail("failed")
      }
    })
    promise.then(data => {
      Axios
        .get("/admin/getanswers", {
          headers: {
            'Authorization': `token ${data.jwt}`
          }
        })
        .then(res => {
          if (res.data.error) {
            setError(res.data.error)
            setSpinner(false)
          } else {
            setError(errorInitial)
            setAnswer(res.data.success)
            setSpinner(false)
          }
        })
    })
  }, [])


  const exportToCSV = (e) => {
    setSpinner(true)
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    var examName = e.target.id.split("-")
    var token = JSON.parse(localStorage.getItem("UserData"))
    Axios.post("/admin/downloaddata", examName, {
      headers: {
        'Authorization': `token ${token.jwt}`
      }
    })
      .then(res => {
        if (res.data.error) {
          setError({ ...error, database: res.data.error })
        } else {
          setError(errorInitial)
          const ws = XLSX.utils.json_to_sheet(res.data.success);
          const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, examName[1] + "-" + examName[2] + "-" + examName[3] + "-" + examName[4] + "-" + examName[5] + "-" + examName[6] + "-" + examName[7] + "-" + examName[8] + "-" + examName[9] + fileExtension);
          setSpinner(false)
        }
      })
  }
  return (
    <div className="view-saved">
      {error.database ? <Error test={error.database} /> : ""}
      <div className="view-saved-container row">
        {
          answer
            ?
            answer.map(elem => {
              return (
                <div className="exam-holder" key={elem.examName}>
                  <div className="exam-container">
                    <div className="exam-name" id={"div-" + elem.examName} onClick={exportToCSV}>
                      <p id={"p-" + elem.examName}>{elem.examName}</p>
                    </div>
                  </div>
                </div>
              )
            })
            :
            <h1>No Answer submitted yet</h1>
        }
      </div>
      {
        spinner ? <Loading /> : ""
      }
    </div>
  )
}
export default AdminViewSaved