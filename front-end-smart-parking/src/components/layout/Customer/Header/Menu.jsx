import { MENU_CUSTOMER_ID } from "@/utils/constants";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Menu = () => {
  const selecting = useSelector(state => state.menuSelect);
  const authened = useSelector(state => state.authen);
  return (
    <div className="middle-box">
      <div className="menu">
        {authened ? <><div className={selecting === MENU_CUSTOMER_ID.TONG_QUAN ? "menu-item br3 select-item" : "menu-item br3"}>
          Tổng quan
        </div>
          <Link className="no-style cw" to={"/deposit"}>
            <div className={selecting === MENU_CUSTOMER_ID.NAP_TIEN ? "menu-item br3 select-item" : "menu-item br3"} >
              Nạp tiền
            </div>
          </Link>
          <Link className="no-style cw" to={"/choose/location"}>
            <div className={selecting === MENU_CUSTOMER_ID.DAT_VE ? "menu-item br3 select-item" : "menu-item br3"}>
              Đặt vé
            </div>
          </Link>
          <Link className="no-style cw" to={"/list/ticket"}>
            <div className={selecting === MENU_CUSTOMER_ID.VE_SU_DUNG ? "menu-item br3 select-item" : "menu-item br3"}>
              Vé sử dụng
            </div>
          </Link>
          <Link className="no-style cw" to={"/card"}>
            <div className={selecting === MENU_CUSTOMER_ID.QUAN_LY_THE ? "menu-item br3 select-item" : "menu-item br3"}>
              Quản lý thẻ
            </div>
          </Link></>
          : <>
            <Link className="no-style cw" to={"/"}>
              <div className={selecting === MENU_CUSTOMER_ID.GIOI_THIEU ? "menu-item br3 select-item" : "menu-item br3"}>
                Giới thiệu
              </div>
            </Link>
            <Link className="no-style cw" to={"/choose/location"}>
              <div className={selecting === MENU_CUSTOMER_ID.DAT_VE ? "menu-item br3 select-item" : "menu-item br3"}>
                Đặt vé
              </div>
            </Link>
          </>}
      </div>
    </div>
  )
}

export default Menu
