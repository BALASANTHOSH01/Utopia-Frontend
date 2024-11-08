import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../../assets/pin.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const SelectLocation = (props) => {
  const {trekDetails, setTrekDetails} = props;

  const [latitude, setLatitude] = useState(13);
  const [longitude, setLongitude] = useState(77);
  const [marker, setMarker] = useState(null);

  // Add Marker on Map Click
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setTrekDetails({...trekDetails, coordinates: {latitude: e.latlng.lat, longitude: e.latlng.lng}});
        setLongitude(e.latlng.lng);
        setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <div>
      <div className="input-form flex flex-row items-center gap-6 my-3">

        <div className="flex flex-row items-center">
        <label>Latitude:</label>
        <input
          type="number"
          value={latitude}
          className="border border-gray-400 ml-[1%] px-3"
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
        />
        </div>

        <div className="flex flex-row items-center">
        <label>Longitude:</label>
        <input
          type="number"
          value={longitude}
          className="border border-gray-400 ml-[1%] px-3"
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
        />
        </div>
        {/* <button
          onClick={() => setMarker({ lat: latitude, lng: longitude })} 
        >
          Add Trek Location
        </button> */}
      </div>
      
      <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "20px" }}>
        <TileLayer url="https://tile.opentopomap.org/{z}/{x}/{y}.png"  />
        
        {/* Display the single marker if it exists */}
        {marker && (
          <Marker position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              Trek Location - Latitude: {marker.lat}, Longitude: {marker.lng}
            </Popup>
          </Marker>
        )}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default SelectLocation;
