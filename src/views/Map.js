import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Set up custom marker icon if needed, as Leaflet's default icon may not load properly in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapWrapper = () => {
  // Coordinates for Desa Srigading, Kecamatan Lawang
  const position = [-7.888111, 112.728120]; // Update with actual coordinates

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <h2>Desa Srigading</h2>
          <p>Welcome to Desa Srigading, Kecamatan Lawang!</p>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

function Map() {
  return (
    <>
      <div className="content">
        <div
          id="map"
          className="map"
          style={{ position: "relative", height: "500px", overflow: "hidden" }}
        >
          <MapWrapper />
        </div>
      </div>
    </>
  );
}

export default Map;
