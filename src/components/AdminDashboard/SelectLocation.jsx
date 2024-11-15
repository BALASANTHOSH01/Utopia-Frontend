import React, { useState, useEffect } from "react";
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

const DEFAULT_LAT = 13;
const DEFAULT_LNG = 77;

const SelectLocation = ({ trekDetails, setTrekDetails }) => {
  // Initialize state with coordinates from trekDetails or defaults
  const [latitude, setLatitude] = useState(trekDetails.coordinates.latitude || DEFAULT_LAT);
  const [longitude, setLongitude] = useState(trekDetails.coordinates.longitude || DEFAULT_LNG);
  const [inputLat, setInputLat] = useState(latitude.toString());
  const [inputLng, setInputLng] = useState(longitude.toString());
  const [marker, setMarker] = useState(
    trekDetails.coordinates.latitude && trekDetails.coordinates.longitude
      ? {
          lat: trekDetails.coordinates.latitude,
          lng: trekDetails.coordinates.longitude,
        }
      : null
  );

  // Update coordinates in both local state and parent component
  const updateCoordinates = (lat, lng) => {
    const validLat = isNaN(lat) ? DEFAULT_LAT : lat;
    const validLng = isNaN(lng) ? DEFAULT_LNG : lng;

    setLatitude(validLat);
    setLongitude(validLng);
    setMarker({ lat: validLat, lng: validLng });
    setTrekDetails((prev) => ({
      ...prev,
      coordinates: {
        latitude: validLat,
        longitude: validLng,
      },
    }));
  };

  // Handle manual input changes
  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    setInputLat(value);
    
    // Only update coordinates if the value is a valid number
    if (value === "") {
      updateCoordinates(DEFAULT_LAT, longitude);
    } else {
      const lat = parseFloat(value);
      if (!isNaN(lat)) {
        updateCoordinates(lat, longitude);
      }
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    setInputLng(value);
    
    // Only update coordinates if the value is a valid number
    if (value === "") {
      updateCoordinates(latitude, DEFAULT_LNG);
    } else {
      const lng = parseFloat(value);
      if (!isNaN(lng)) {
        updateCoordinates(latitude, lng);
      }
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        updateCoordinates(lat, lng);
        setInputLat(lat.toString());
        setInputLng(lng.toString());
      },
    });
    return null;
  };

  // Sync with parent component's coordinates if they change
  useEffect(() => {
    if (trekDetails.coordinates.latitude !== latitude || 
        trekDetails.coordinates.longitude !== longitude) {
      const newLat = trekDetails.coordinates.latitude || DEFAULT_LAT;
      const newLng = trekDetails.coordinates.longitude || DEFAULT_LNG;
      
      setLatitude(newLat);
      setLongitude(newLng);
      setInputLat(newLat.toString());
      setInputLng(newLng.toString());
      setMarker({
        lat: newLat,
        lng: newLng,
      });
    }
  }, [trekDetails.coordinates]);

  return (
    <div>
      <div className="input-form flex flex-row items-center gap-6 my-3">
        <div className="flex flex-row items-center">
          <label>Latitude:</label>
          <input
            type="text"
            value={inputLat}
            className="border border-gray-400 ml-[1%] px-3"
            onChange={handleLatitudeChange}
          />
        </div>

        <div className="flex flex-row items-center">
          <label>Longitude:</label>
          <input
            type="text"
            value={inputLng}
            className="border border-gray-400 ml-[1%] px-3"
            onChange={handleLongitudeChange}
          />
        </div>
      </div>

      <MapContainer 
        key={`${latitude}-${longitude}`}
        center={[latitude, longitude]} 
        zoom={13} 
        style={{ height: "400px", width: "100%", borderRadius: "20px" }}
      >
        <TileLayer url="https://tile.opentopomap.org/{z}/{x}/{y}.png" />

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