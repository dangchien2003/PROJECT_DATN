import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// forcus thẳng tới địa điểm
const SetViewOnLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13); // mức zoom 13
  }, [position, map]);

  return null;
};

// forcus từ từ tới địa điểm
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15, {
      duration: 1.0, // Thời gian chuyển đổi (giây)
    });
  }, [position, map]);

  return null;
};

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
// const data = [
//   {
//     position: [10.762622, 106.660172],
//     popupContent: <div>abc</div>,
//   },
// ];
const Map = ({ data = [], ...prop }) => {
  const position1 = [10.762622, 106.660172]; // AEON MALL Hà Đông
  const position2 = [21.02842, 105.7909]; // Điểm thứ 2
  data = [
    {
      position: position1,
      popupContent: (
        <a
          href="https://maps.app.goo.gl/yKEiZzg7DLmJzvHu8"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", textDecoration: "none" }}
        >
          AEON MALL Hà Đông
        </a>
      ),
    },
    {
      position: position2,
      popupContent: (
        <a
          href="https://maps.app.goo.gl/yKEiZzg7DLmJzvHu8"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", textDecoration: "none" }}
        >
          AEON MALL Hà Đông
        </a>
      ),
    },
  ];
  return (
    <MapContainer center={position1} zoom={13} {...prop}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToLocation position={position2} />
      {data.map((location) => {
        return (
          <Marker position={location.position} icon={customIcon}>
            <Popup>{location.popupContent}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
