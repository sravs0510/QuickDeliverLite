// src/pages/TrackMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapTracker = () => {
  const [coords, setCoords] = useState([15.4786, 78.4836]); // Default to Nandyal
  const [locationName, setLocationName] = useState('');

  const getLocationCoords = async (location) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords([lat, lon]);
        setLocationName(location);
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get('location');
    if (location) {
      getLocationCoords(location);
    }
  }, []);

  const markerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
  });

  return (
    <div className="h-screen w-full">
      <MapContainer center={coords} zoom={10} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={markerIcon}>
          <Popup>{locationName || 'Current Delivery Location'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapTracker;
