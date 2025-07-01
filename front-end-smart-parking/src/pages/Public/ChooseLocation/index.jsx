import ChildContent from '@/components/layout/Customer/ChildContent'
import "./style.css"
import React, { useState } from 'react'
import LocationSearch from './LocationSearch'
import LocationList from './LocationList'

const ChooseLocation = () => {
  const [dataSearch] = useState({
    name: null,
    category: null, 
  });

  return (
    <div id='choose-location'>
      <ChildContent>
        <h2 className='page-name'>Tìm kiếm địa điểm</h2>
        <div>
          <LocationSearch dataSearch={dataSearch}/>
        </div>
        <div>
          <LocationList dataSearch={dataSearch}/>
        </div>
      </ChildContent>
    </div>
  )
}

export default ChooseLocation
