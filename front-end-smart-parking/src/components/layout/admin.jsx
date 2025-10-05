import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { ADMIN_MENU } from "../../utils/menu";
import { Outlet, useNavigate } from "react-router-dom";
import ContactTrouble from "../ContactTrouble";
import Notifitation from "../Notification";
import Account from "../Account";
import "./style.css";
import { ToastContainer } from "react-toastify";
import LogoParking from "../Logo";
import WebSocket from "@/configs/websocket";
import { useDispatch, useSelector } from "react-redux";
import { getActor } from "@/service/localStorageService";
import { authened } from "@/store/authenSlice";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { checkAccessToken } from "@/service/authenticationService";
import { processRefreshToken } from "@/configs/axiosConfig";
import { getAccessToken } from "@/service/cookieService";
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const selecting = useSelector(state => state.menuSelect);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const authen = useSelector(state => state.authen);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAccess = () => {
    let actor = getActor();
    if (actor !== "admin") {
      navigate("/404")
    }
  }
  checkAccess();
  useEffect(() => {
    if (!authen) {
      return;
    }
    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [authen]);

  // kiểm tra token n 
  useEffect(() => {
    if (authen) {
      return;
    }
    const access = getAccessToken();
    if (access) {
      checkAccessToken({ token: access }).then(respose => {
        const result = getDataApi(respose);
        if (result === true) {
          dispatch(authened(true));
        }
        else {
          processRefreshToken();
        }
      })
        .catch(e => {
          const response = getDataApi(e);
          toastError(response.message);
          dispatch(authened(false));
        })
    } else {
      dispatch(authened(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selecting])

  // kết nối websocket
  useEffect(() => {
    let openWs = process.env.REACT_APP_OPEN_WS;
    if (openWs === '1') {
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
      setOpenKeys(prev =>
        prev.includes(parentKey) ? prev : [...prev, parentKey]
      );
    }
  }, [selecting]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical"><LogoParking /></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={ADMIN_MENU}
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
export default AdminLayout;
