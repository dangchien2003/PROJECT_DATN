import { data } from '@/pages/Public/DetailTicket/fakedata'
import { List, Tooltip } from 'antd'
import Search from 'antd/es/input/Search'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'

const Location = ({ onChoose, selected }) => {
  if (selected?.id) {
    selected = selected.id;
  }

  if (selected) {
    var dataSelected = null;
    for (const item of data) {
      if (item.id === selected) {
        dataSelected = item;
        break;
      }
    }
    if (dataSelected) {
      onChoose(dataSelected)
    }
  }
  return (
    <div className='list-locaiton-wrapper'>
      <h2>Chọn địa điểm</h2>
      <div className='list-locaiton br3 pr'>
        <div className='scroll'>
          <div className='search'>
            <Search className='input' placeholder="Tìm kiếm địa điểm"
            enterButton={
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
                  if (onChoose) {
                    onChoose(item);
                  }
                }}
                actions={[
                  selected === item.id ? <IoCheckmarkDoneOutline fontSize={20} color="#52c41a" /> : null
                ]}
              >
                <List.Item.Meta
                  title={<div>{item.name}</div>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default Location
