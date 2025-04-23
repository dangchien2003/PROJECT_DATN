import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// forcus thẳng tới địa điểm
// const SetViewOnLocation = ({ position }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(position, 13); // mức zoom 13
//   }, [position, map]);
//   return null;
// };

// forcus từ từ tới địa điểm
const FlyToLocation = ({ position, loadFist }) => {
  const map = useMap();
  useEffect(() => {
    if (loadFist) {
      return;
    }
    map.flyTo(position, 10, {
      duration: 1.0, // Thời gian chuyển đổi (giây)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const focusDefault = [10.762622, 106.660172];
const Map = ({ data = [], ...prop }) => {
  const [loadFist, setLoadFirst] = useState(false);

  useEffect(() => {
    if(data.length > 0) {
      setLoadFirst(true);
    }
  }, [data])
  return (
    <MapContainer center={focusDefault} zoom={13} {...prop}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToLocation position={focusDefault} loadFist={loadFist} />
      {data.map((location, index) => {
        return (
          <Marker position={location.position} icon={customIcon} key={index}>
            <Popup>{location.popupContent}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
