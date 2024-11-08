import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../../assets/pin.png";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MultipleMapLocations = ({ locations }) => {
  // Check if locations array is not empty and the first location has valid latitude and longitude
  const validLocations = locations?.filter(
    (location) => location.latitude !== undefined && location.longitude !== undefined
  );

  if (!validLocations || validLocations.length === 0) {
    return <p>No valid locations to display on the map.</p>;
  }

  return (
    <MapContainer
      center={[validLocations[0].latitude, validLocations[0].longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "20px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {validLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div
              onClick={() => window.open(`/package/${location?.id}` || "#", "_blank")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {location.tooltip || "No description available"}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MultipleMapLocations;
