import react, { useEffect } from "react"

function Index() {

  useEffect(() => {
    window.open('/admin', "newWin", "fullscreen=yes")
  }, [])
  return (<h1>Index</h1>)
}

export default Index