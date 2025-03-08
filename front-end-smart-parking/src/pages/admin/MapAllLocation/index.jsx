import Map from "@/components/Map"
import { dataMapAll } from "@/components/Map/fakeData"

const MapAllLocation = () => {
  return (
    <div style={{height: "100%"}}>
      <Map data={dataMapAll} key={"mapAll"} style={{height: "100%"}}/>
    </div>
  )
}

export default MapAllLocation
