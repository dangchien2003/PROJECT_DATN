import logo from "@image/logo_parking.png"
import './style.css'

const LogoParking = () => {
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <img style={{width: 100}} src={logo} alt="logo" />
    </div>
  )
}

export default LogoParking
