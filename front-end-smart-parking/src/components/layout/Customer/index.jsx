import Header from './Header'
import Footer from './Footer'
import './style.css'
import { Outlet } from 'react-router-dom'

const CustomerLayout = () => {
  return (<div className='customer-layout'>
    <Header />
    <div className='content'>
      <Outlet />
    </div>
    <Footer />
  </div>)
}

export default CustomerLayout