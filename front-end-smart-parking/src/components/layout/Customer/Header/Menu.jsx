import { Link } from "react-router-dom"

const Menu = () => {
  return (
    <div className="middle-box">
      <div className="menu">
        <Link className="no-style cw" to={"/deposit"}>
          <div className="menu-item ">
            Nạp tiền
          </div>
        </Link>
        <Link className="no-style cw" to={"/choose/location"}>
          <div className="menu-item br3">
            Đặt vé
          </div>
        </Link>
        <Link className="no-style cw" to={"/list/ticket"}>
          <div className="menu-item br3">
            Vé sử dụng
          </div>
        </Link>
        <Link className="no-style cw" to={"/card"}>
          <div className="menu-item br3">
            Quản lý thẻ
          </div>
        </Link>
        <div className="menu-item br3">
          Thống kê
        </div>
      </div>
    </div>
  )
}

export default Menu
