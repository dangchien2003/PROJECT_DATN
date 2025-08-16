import ChildContent from '@/components/layout/Customer/ChildContent'
import "./style.css"
import React, { useEffect, useState } from 'react'
import LocationSearch from './LocationSearch'
import LocationList from './LocationList'
import { useSelectMenu } from '@/hook/useSelectMenu'
import { MENU_CUSTOMER_ID } from '@/utils/constants'

const ChooseLocation = () => {
  const [dataSearch] = useState({
    name: null,
    category: null, 
  });  
  const {select} = useSelectMenu();

  useEffect(() => {
    select(MENU_CUSTOMER_ID.DAT_VE);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])


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
