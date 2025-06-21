import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Route from Nandyal to Tadipatri (mocked lat/lng)
const routeCoords = [
  { lat: 15.4887, lng: 78.4867 }, // Nandyal
  { lat: 15.3774, lng: 78.5400 }, // Koilakuntla
  { lat: 14.8128, lng: 78.3708 }, // Jammalamadugu
  { lat: 14.9123, lng: 78.0090 }  // Tadipatri
];

const MapTracker = () => {
  const [index, setIndex] = useState(0);

  // Move marker every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex < routeCoords.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAdSPWPgx9DZkxnlwkvWWB1GZzlsnozcTU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={routeCoords[0]}
        zoom={9}
      >
        <Polyline path={routeCoords} options={{ strokeColor: '#1e90ff', strokeWeight: 4 }} />
        <Marker position={routeCoords[index]} icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapTracker;
