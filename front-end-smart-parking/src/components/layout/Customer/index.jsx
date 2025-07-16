import WebSocket from '@/configs/websocket'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Footer from './Footer'
import Header from './Header'
import './style.css'
import { getAccessToken } from '@/service/cookieService'
import { checkAccessToken } from '@/service/authenticationService'
import { getDataApi } from '@/utils/api'
import { authened } from '@/store/authenSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toastError } from '@/utils/toast'

const CustomerLayout = () => {
  const dispatch = useDispatch();
  const pageSelecting = useSelector(state => state.menuSelect);

  // kết nối websocket
  useEffect(() => {
    // WebSocket.connect();
    return () => WebSocket.disconnect();
  }, []);

  // kiểm tra token
  useEffect(() => {
    // không check token nếu ở trang đặt vé hoặc giới thiệu
    if (pageSelecting === null || pageSelecting === 3) {
      return;
    }
    const access = getAccessToken();
    if (access) {
      checkAccessToken({ token: access }).then(respose => {
        const result = getDataApi(respose);
        if (result === true) {
          dispatch(authened(true));
        } else {
          dispatch(authened(false));
          // gọi refeshtoken
          // nếu vẫn không được thì quay về login
          window.location.href = '/authen';
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
  }, [pageSelecting])
  return (<div className='customer-layout'>
    <ToastContainer />
    <Header />
    <div id="content-page" className='content-page'>
      <Outlet />
    </div>
    <Footer />
  </div>)
}

export default CustomerLayout