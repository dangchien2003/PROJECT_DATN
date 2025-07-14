import WebSocket from '@/configs/websocket'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Footer from './Footer'
import Header from './Header'
import './style.css'

const CustomerLayout = () => {
  // kết nối websocket
  useEffect(() => {
    // WebSocket.connect();
    return () => WebSocket.disconnect();
  }, []);
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