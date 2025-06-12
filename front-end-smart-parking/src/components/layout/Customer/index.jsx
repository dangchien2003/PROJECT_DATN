import Header from './Header'
import Footer from './Footer'
import './style.css'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const CustomerLayout = () => {
  return (<div className='customer-layout'>
    <ToastContainer/>
    <Header />
    <div className='content-page'>
      <Outlet />
    </div>
    <Footer />
  </div>)
}

export default CustomerLayout