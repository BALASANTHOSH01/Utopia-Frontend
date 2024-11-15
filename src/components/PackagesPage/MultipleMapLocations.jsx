import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Updated coordinates for Indian tourist destinations
const defaultCoordinates = {
  'Manali': { latitude: 32.2396, longitude: 77.1887 },
  'Kashmir': { latitude: 34.0837, longitude: 74.7973 },
  'Srinagar': { latitude: 34.0837, longitude: 74.7973 },
  'Chennai': { latitude: 13.0827, longitude: 80.2707 },
  'Theni': { latitude: 10.0104, longitude: 77.4768 },
  'Himachal Pradesh': { latitude: 31.1048, longitude: 77.1734 },
  'Kovilpalayam': { latitude: 11.1085, longitude: 77.0185 },
};

const MultipleMapLocations = ({ locations = [] }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [zoom, setZoom] = useState(4);

  // Process locations to ensure valid coordinates
  const processedLocations = locations.map(loc => {
    if (!loc.coordinates || (loc.coordinates.latitude === 0 && loc.coordinates.longitude === 0)) {
      // Try to match location name with default coordinates
      let matchedCoords = null;
      
      // Check for exact match
      if (defaultCoordinates[loc.location]) {
        matchedCoords = defaultCoordinates[loc.location];
      } else {
        // Check for partial matches
        const locationParts = loc.location.split(',').map(part => part.trim());
        for (const part of locationParts) {
          if (defaultCoordinates[part]) {
            matchedCoords = defaultCoordinates[part];
            break;
          }
        }
      }
      
      if (matchedCoords) {
        return {
          ...loc,
          coordinates: matchedCoords
        };
      }
    }
    return loc;
  });

  // Filter out locations with invalid coordinates
  const validLocations = processedLocations.filter(loc => 
    loc.coordinates && 
    loc.coordinates.latitude !== 0 && 
    loc.coordinates.longitude !== 0
  );

  useEffect(() => {
    if (validLocations.length > 0) {
      // Calculate bounds to fit all markers
      const latitudes = validLocations.map(loc => loc.coordinates.latitude);
      const longitudes = validLocations.map(loc => loc.coordinates.longitude);
      
      const centerLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
      const centerLng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
      
      setMapCenter([centerLat, centerLng]);
      setZoom(validLocations.length === 1 ? 10 : 5);
    }
  }, [validLocations]);

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No locations available to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validLocations.map((location) => (
          <Marker
            key={location._id}
            position={[
              location.coordinates.latitude,
              location.coordinates.longitude
            ]}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <img 
                  src={location.bannerImage} 
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                <p className="text-sm mb-1">{location.location}</p>
                <p className="text-sm font-semibold mb-1">₹{location.price} per night</p>
                {location.features && location.features.length > 0 && (
                  <p className="text-xs text-gray-600 mb-2">
                    {location.features.slice(0, 3).join(' • ')}
                  </p>
                )}
                <button 
                  onClick={() => window.open(`/package/${location._id}`, '_blank')}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MultipleMapLocations;