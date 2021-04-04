import react, { useEffect } from "react"

function Index() {

  useEffect(() => {
    //window.open('/admin', "newTab", "fullscreen=yes")
    window.open('/admin/login')
  }, [])
  return (<h1>Index</h1>)
}

export default Index