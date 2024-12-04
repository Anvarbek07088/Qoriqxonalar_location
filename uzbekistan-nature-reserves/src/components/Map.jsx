import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 41.2995, // Toshkent koordinatalari
  lng: 69.2401,
};

const reserves = [
  { name: 'Zarafshan Qoʻriqxonasi', location: { lat: 39.654, lng: 64.56 } },
  { name: 'Chatqol Biosfera Qoʻriqxonasi', location: { lat: 41.22, lng: 70.12 } },
];

function Map() {
  return (
    <LoadScript googleMapsApiKey="https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=Uzbekistan">
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={7} center={center}>
        {reserves.map((reserve, index) => (
          <Marker
            key={index}
            position={reserve.location}
            title={reserve.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
