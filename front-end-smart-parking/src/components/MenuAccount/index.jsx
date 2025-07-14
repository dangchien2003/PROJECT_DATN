import { moveAccessToken } from "@/service/cookieService";
import { deleteRefeshToken } from "@/service/localStorageService";
import { DownOutlined } from "@ant-design/icons";
import { Drawer, Dropdown, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountInfo from "../AccountInfo";
import './style.css';
import useResponsiveKey from "@/hook/useReponsive";
import { formatCurrency } from "@/utils/number";
import { useDispatch, useSelector } from "react-redux";
import { getBalance } from "@/service/accountService";
import { setRemaining } from "@/store/remainingSlice";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import SkeletonShimmerLoading from "../Loading/SkeletonShimmerLoading";

const MenuAccount = ({ linkAvatar, isCustomer }) => {
  const dispatch = useDispatch();
  const [loadingRemaining, setLoadingRemaining] = useState(true);
  const { key } = useResponsiveKey();
  const [itemsMenu, setItemsMenu] = useState([]);
  const remaining = useSelector(state => state.remaining);
  const [openAccountInfo, setOpenAccountInfo] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    deleteRefeshToken();
    moveAccessToken();
    navigate("/authen")
  }

  const showDrawer = () => {
    setOpenAccountInfo(true);
  };
  const onClose = () => {
    setOpenAccountInfo(false);
  };

  const itemsBase = [
    {
      key: "0",
      label: <>{loadingRemaining ? <SkeletonShimmerLoading /> : <div className="bold" onClick={showDrawer}>Số dư: <><span className='quantity'>
        <span>{remaining > 9999999 ? formatCurrency(9999999) : formatCurrency(remaining)}</span>
        {remaining > 9999999 && <sup>+</sup>}
      </span>
        <span style={{ paddingLeft: 4 }}>Đ</span></></div>}</>,
    },
    {
      key: "1",
      type: "divider",
    },
    {
      key: "2",
      label: <div onClick={showDrawer}>Thông tin tài khoản</div>,
    },
    {
      key: "3",
      label: <a href="/account-info">Đổi mật khẩu</a>,
    },
    {
      key: "4",
      label: <Link to={"/account/transaction"}><div>Quản lý giao dịch</div></Link>,
    },
    {
      type: "divider",
    },
    {
      key: "5",
      label: (
        <div onClick={handleLogout}>
          Đăng xuất
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (key !== "xs") {
      setItemsMenu(itemsBase.filter(item => item.key !== "0" && item.key !== "1"))
    } else {
      setItemsMenu(itemsBase)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [key, loadingRemaining]);

  useEffect(() => {
    setLoadingRemaining(true);
    getBalance().then((response) => {
      const data = getDataApi(response);
      dispatch(setRemaining(data));
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      })
      .finally(() => {
        setLoadingRemaining(false);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  return (
    <>
      <Dropdown
        menu={{
          items: itemsMenu,
          selectable: true,
        }}
        trigger={"click"}
        className="menu-account"
      >
        <Typography.Link>
          <Space>
            <img
              src={linkAvatar}
              alt="avatar"
              style={{ borderRadius: "50%", width: 50, height: 50 }}
            />
            <DownOutlined style={{ color: "black" }} />
          </Space>
        </Typography.Link>
      </Dropdown>
      <Drawer
        title="Thông tin Tài khoản"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={openAccountInfo}
      >
        <AccountInfo />
      </Drawer>
    </>
  );
};

export default MenuAccount;
