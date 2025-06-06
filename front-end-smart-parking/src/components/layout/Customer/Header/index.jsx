import LogoParking from "@/components/Logo"
import MenuCustom from "./Menu"
import Notifitation from "@/components/Notification"
import MenuAccount from "@/components/MenuAccount"
import Remaining from "./Remaining"
import { Menu } from "antd"
import { ADMIN_MENU } from "@/utils/menu"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import { AiOutlineMenuFold } from "react-icons/ai"

const Header = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="header">
      <div className="logo">
        <LogoParking />
      </div>
      <div className="menu-desktop">
        <MenuCustom />
      </div>
      <Sider className="menu-mobile" trigger={null} collapsible collapsed={collapsed}
        style={{
          position: "absolute",
          top: 90,
          width: 200,
          zIndex: 1000
        }}>
        <div className={collapsed ? "icon-menu collapsed-true" : "icon-menu collapsed-false"}>
          <AiOutlineMenuFold onClick={() => {setCollapsed(pre => !pre)}}/>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={ADMIN_MENU}
        />
      </Sider>
      <div className="end-box">
        <Notifitation />
        <div class="account">
          <Remaining />
          <MenuAccount
            linkAvatar={
              "https://imgcdn.stablediffusionweb.com/2024/3/24/17ee935b-c63a-4374-8fc3-91b2559e02f2.jpg"
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Header
