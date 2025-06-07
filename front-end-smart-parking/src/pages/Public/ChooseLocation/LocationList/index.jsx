import React from 'react'
import LocationCard from './LocationCard'
import { Flex, Pagination } from 'antd'

const LocationList = () => {
  return (
    <div className='location-list'>
      <LocationCard />
      <Flex justify='end'>
        <Pagination defaultCurrent={1} total={5000} pageSize={10}/>
      </Flex>
    </div>
  )
}

export default LocationList
