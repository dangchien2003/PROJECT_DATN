import LogoParking from "@/components/Logo"
import MenuAccount from "@/components/MenuAccount"
import Notifitation from "@/components/Notification"
import useResponsiveKey from "@/hook/useReponsive"
import { getAvatar } from "@/service/localStorageService"
import { CUSTOMER_MENU } from "@/utils/menu"
import noAvatar from '@image/no_avatar2.png'
import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import MenuCustom from "./Menu"
import Remaining from "./Remaining"

const Header = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [totalHeight, setTotalHeight] = useState("100vh");
  const selecting = useSelector(state => state.menuSelect);
  const authened = useSelector(state => state.authen);
  const { key } = useResponsiveKey();
  const avatar = getAvatar();

  useEffect(() => {
    const updateHeight = () => {
      const contentElement = document.getElementById("content-page");
      if (!contentElement) return;

      const contentHeight = contentElement.scrollHeight + 114;
      const windowHeight = window.innerHeight - 55;
      const maxHeight = Math.max(contentHeight, windowHeight);
      setTotalHeight(maxHeight);
    };

    updateHeight();

    const contentElement = document.getElementById("content-page");
    const mutationObserver = new MutationObserver(updateHeight);
    if (contentElement) {
      mutationObserver.observe(contentElement, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [location.pathname]);

  // điều chỉnh menu

  return (
    <div className="header">
      <div className={collapsed ? "icon-menu collapsed-true" : "icon-menu collapsed-false"}>
        {
          collapsed ? <AiOutlineMenuUnfold onClick={() => { setCollapsed(pre => !pre) }} /> :
            <AiOutlineMenuFold onClick={() => { setCollapsed(pre => !pre) }} />
        }
      </div>
      <div className="logo">
        <LogoParking />
      </div>
      <div className="menu-desktop">
        <MenuCustom />
      </div>
      <Sider className={collapsed ? "menu-mobile" : "menu-mobile show"} trigger={null} collapsible collapsed={collapsed}
        style={{
          height: totalHeight,
          position: "absolute",
          top: 90,
          width: 200,
          zIndex: 1000
        }}>
        <Menu
          theme="dark"
          mode="inline"
          items={CUSTOMER_MENU}
          selectedKeys={selecting ? selecting.toString() : null}
        />
      </Sider>
      <div className="end-box">
        {authened &&
          <>
            <Notifitation />
            <div class="account">
              {key !== 'xs' && <Remaining />}
              <MenuAccount
                linkAvatar={ avatar || noAvatar}
              />
            </div>
          </>}

      </div>
    </div>
  )
}

export default Header
