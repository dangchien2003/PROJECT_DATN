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

// căn chỉnh lại map => cần sử dụng khi mở trong modal
const AutoResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
};

// forcus từ từ tới địa điểm
const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    const lat = Number(position?.[0]);
    const lng = Number(position?.[1]);

    const isValidLatLng = Number.isFinite(lat) && Number.isFinite(lng);

    if (!map || !isValidLatLng) {
      return;
    }

    // Đợi một nhịp sau render để map chắc chắn sẵn sàng
    const timeout = setTimeout(() => {
      const latLng = L.latLng(lat, lng);
      map.flyTo(latLng, 13, { duration: 1.0 });
    }, 200);

    return () => clearTimeout(timeout);
  }, [position, map]);

  return null;
};

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const focusDefault = [10.762622, 106.660172];
const Map = ({ data = [], focus, ...prop }) => {
  const [focusMap, setFocusMap] = useState(focus ? focus : focusDefault);

  useEffect(() => {
    if(focus) {
      setFocusMap(focus);
    } else if(data.length > 0) {
      setFocusMap(data[0].position);
    }
  }, [data, focus])
  return (
    <MapContainer center={focusMap} zoom={13} {...prop}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AutoResizeMap />
      <FlyToLocation position={focusMap} />
      {data.map((location, index) => (
        <Marker position={location.position} icon={customIcon} key={index}>
          <Popup>{location.popupContent}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
