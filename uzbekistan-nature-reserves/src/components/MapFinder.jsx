import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapFinder = () => {
  const [location, setLocation] = useState(""); // Kiritilgan hudud
  const [coordinates, setCoordinates] = useState([41.2995, 69.2401]); // Default: Toshkent koordinatalari
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!location) {
      setError("Hudud nomini kiriting!");
      return;
    }

    try {
      setError(null); // Xatolikni tozalash
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
      } else {
        setError("Hudud topilmadi. Iltimos, qayta urinib ko'ring.");
      }
    } catch (err) {
      setError("Ma'lumot olishda xatolik yuz berdi.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>Hududni Haritada Topish</h2>
      <input
        type="text"
        placeholder="Hudud nomini kiriting (masalan: Toshkent)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Qidirish
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: "400px", marginTop: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates}>
          <Popup>
            Qidirilgan joy: <strong>{location}</strong>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapFinder;
