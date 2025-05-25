import ChildContent from '@/components/layout/Customer/ChildContent'
import { Flex } from 'antd'
import React from 'react'
import './style.css'
import { FaCircleDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import Map from '@/components/Map'
import TicketCardMinimize from '../ChooseTicket/TicketCardMinimize'

const DetailLocation = () => {
  const html = `
  <div>
    <h2 style="text-align: center">Giới thiệu về React</h2>
    <p>React là thư viện JavaScript phổ biến dùng để xây dựng giao diện người dùng.</p>
    
    <img 
      src="https://reactjs.org/logo-og.png" 
      alt="React Logo" 
      width="300" 
      style="border-radius: 8px; margin: 10px 0;" 
    />

    <ul>
      <li>Dễ học</li>
      <li>Hiệu suất cao</li>
      <li>Cộng đồng lớn mạnh</li>
    </ul>

    <p>Xem thêm tại: <a href="https://reactjs.org" target="_blank">reactjs.org</a></p>
    <h2 style="text-align: center">Giới thiệu về React</h2>
    <p>React là thư viện JavaScript phổ biến dùng để xây dựng giao diện người dùng.</p>
    
    <img 
      src="https://reactjs.org/logo-og.png" 
      alt="React Logo" 
      width="300" 
      style="border-radius: 8px; margin: 10px 0;" 
    />

    <ul>
      <li>Dễ học</li>
      <li>Hiệu suất cao</li>
      <li>Cộng đồng lớn mạnh</li>
    </ul>

    <p>Xem thêm tại: <a href="https://reactjs.org" target="_blank">reactjs.org</a></p>
  </div>
`;
  return (
    <div id='detail-location'>
      <ChildContent backgroundColor='#f0f0f0'>
        <Flex className='info br3' gap={16}>
          <div className='image-wrapper'>
            <img src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482784oup/anh-mo-ta.png" alt="ảnh địa điểm" className='br3' />
          </div>
          <div className='detail'>
            <div className='text'>
              <h2>Eaon mall hà đông</h2>
              <div className='address'>
                Địa chỉ: AEON MALL Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Quận Long Biên, Hà Nội
              </div>
              <div>Mở cửa từ 11:30 - 22:20</div>
              <div>Sức chứa: 1000</div>
              <div><FaCircleDot className='status' />Đang đông đúc</div>
            </div>
            <div>
              <Link to={"/choose/ticket"} className=''>
                <button className='btn-choose br3'>
                  <span>Chọn vé</span>
                </button>
              </Link>
            </div>
          </div>
        </Flex>
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0'>
        <Flex wrap="wrap" gap={16} className='box2'>
          <div className='description-wrapper '>
            <div className='title-box br3'>Giới thiệu</div>
            <div className='description br3 hide-scrollbar'>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
            <iframe width={"100%"} height={300} src={"https://www.youtube.com/embed/xNuY3w7dxj8?si=OAXSDfqe1vpf02LQ"} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" />
          <div className='map-wrapper'>
            <div className='title-box br3'>Vị trí</div>
            <Map className="map br3" />
          </div>
        </Flex>
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0'>
      </ChildContent>
      {/* <ChildContent backgroundColor='#f0f0f0'>
        <div>Sơ đồ</div>
      </ChildContent> */}
      <ChildContent backgroundColor='#f0f0f0'>
        <div className='recomment-wrapper br3'>
          <div className='view-all'>
            <Link className='no-style hover' to={"/choose/ticket"}>{">> "}Xem tất cả</Link>
          </div>
          <div className='recomment'>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
            <TicketCardMinimize/>
          </div>
        </div>
      </ChildContent>
    </div>
  )
}

export default DetailLocation
