import WebSocket from "@/configs/websocket";
import { getActor } from "@/service/localStorageService";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PARTNER_MENU } from "../../utils/menu";
import Account from "../Account";
import ContactTrouble from "../ContactTrouble";
import LogoParking from "../Logo";
import Notifitation from "../Notification";
import "./style.css";
const { Header, Sider, Content } = Layout;

const PartnerLayout = () => {
  const selecting = useSelector((state) => state.menuSelect);
  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const authen = useSelector((state) => state.authen);
  const navigate = useNavigate();

  const checkAccess = () => {
    let actor = getActor();
    if (actor !== "partner") {
      navigate("/404");
    }
  };
  checkAccess();
  useEffect(() => {
    if (!authen) {
      return;
    }
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authen]);

  // kết nối websocket
  useEffect(() => {
    // let openWs = process.env.REACT_APP_OPEN_WS;
    let openWs = localStorage.getItem("openWS");

    if (openWs === "1") {
      WebSocket.connect();
    }
    return () => WebSocket.disconnect();
  }, []);
  const handleOpenChange = (keys) => {
    // AntD sẽ trả về toàn bộ keys đang mở
    setOpenKeys(keys);
  };

  useEffect(() => {
    if (selecting) {
      const parentKey = selecting.includes(".")
        ? selecting.split(".")[0]
        : selecting;
      setOpenKeys((prev) =>
        prev.includes(parentKey) ? prev : [...prev, parentKey]
      );
    }
  }, [selecting]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <LogoParking />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={PARTNER_MENU}
          selectedKeys={selecting ? selecting : null}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: "flex", height: 64, padding: 8 }}>
            <ContactTrouble />
            <Notifitation />
            <Account />
          </div>
        </Header>
        <Content
          className="content"
          style={{
            margin: "24px 16px",
            padding: 24,
            height: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default PartnerLayout;
