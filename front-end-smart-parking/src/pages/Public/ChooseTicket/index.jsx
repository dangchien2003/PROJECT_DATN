import ChildContent from '@/components/layout/Customer/ChildContent'
import './style.css'
import React from 'react'
import { Flex, Pagination, Radio, Tooltip } from 'antd'
import TicketCard from './TicketCard'
import { FaCar, FaMotorcycle } from 'react-icons/fa6'

const ChooseTicket = () => {
  return (
    <div id='choose-ticket'>
      <ChildContent>
        <h3 className='page-name'>Chọn vé
        </h3>
        <div className='head'>
          <div className='location-name'>EAON MALL Hà Đông
          </div>
          <div className='publisher'>EAON MALL GROUP</div>
          <Flex justify='center'>
            <Radio.Group
              // value={value}
              options={[
                { value: 1, label: 'Vé giờ' },
                { value: 2, label: 'Vé ngày' },
                { value: 3, label: 'Vé tuần' },
                { value: 4, label: 'Vé tháng' },
              ]}
            />
          </Flex>
          <Flex justify='center' style={{ paddingTop: 8 }}>
            <Radio.Group
              // value={value}
              options={[
                {
                  value: 1, label:
                    <span>
                      <Tooltip title="Xe máy">
                        <FaMotorcycle />
                      </Tooltip>
                    </span>
                },
                {
                  value: 2, label:
                    <span>
                      <Tooltip title="Ô tô">
                        <FaCar />
                      </Tooltip>
                    </span>
                },
                {
                  value: 3, label:
                    <span>
                      <Tooltip title="Hỗn hợp">
                        <FaMotorcycle style={{ marginRight: 4 }} />
                        <FaCar />
                      </Tooltip>
                    </span>
                },
              ]}
            />
          </Flex>
        </div>
      </ChildContent>
      <ChildContent backgroundColor='rgb(250, 250, 250)' className='parent-list-ticket'>
        <div className='list-card'>
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
          <TicketCard />
        </div>
        <Flex justify='center'>
          <Pagination defaultCurrent={1} total={5000} pageSize={10} />
        </Flex>
      </ChildContent>
    </div>
  )
}

export default ChooseTicket
