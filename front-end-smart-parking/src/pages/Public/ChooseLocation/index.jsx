import ChildContent from '@/components/layout/Customer/ChildContent'
import "./style.css"
import React from 'react'
import LocationSearch from './LocationSearch'
import LocationList from './LocationList'

const ChooseLocation = () => {
  return (
    <div id='choose-location'>
      <ChildContent>
        <h3 className='page-name'>Tìm kiếm địa điểm</h3>
        <div>
          <LocationSearch />
        </div>
        <div>
          <LocationList />
        </div>
      </ChildContent>
    </div>
  )
}

export default ChooseLocation
