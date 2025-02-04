import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
