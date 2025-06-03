import ChildContent from '@/components/layout/Customer/ChildContent'
import Map from '@/components/Map'
import { Flex, List, Tooltip } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { data } from './fakedata'

const Location = ({onChooseLocation}) => {
  const [selected, setSelected] = useState(null);
  const handleClickLocation = (item) => {
    if(onChooseLocation) {
      onChooseLocation(item);
    }
  }
  return (
    <ChildContent backgroundColor='#f0f0f0' >
      <Flex wrap="wrap" gap={16} className='box2'>
        <div className='list-locaiton-wrapper'>
          <div className='title-box br3'>Địa điểm sử dụng</div>
          <div className='list-locaiton br3 pr'>
            <div>
              Sử dụng tại <b>30</b> địa điểm khác nhau trên khắp cả nước
            </div>
            <div className='scroll'>
              <div className='search '>
                <Search className='input' placeholder="Tìm kiếm địa điểm" enterButton={
                  <Tooltip title="Tìm kiếm">
                    <span>
                      <FaSearch />
                    </span>
                  </Tooltip>} />
              </div>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item
                    onClick={() => {
                      handleClickLocation(item);
                      setSelected(item);
                    }}
                    actions={[
                      selected?.id === item.id ? <IoCheckmarkDoneOutline fontSize={20} color="#52c41a" /> : null
                    ]}
                  >
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.name}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
        <div className='map-wrapper'>
          <div className='title-box br3'>Bản đồ</div>
          <Map className="map br3" focus={selected?.position}/>
        </div>
      </Flex>
    </ChildContent>

  )
}

export default Location
