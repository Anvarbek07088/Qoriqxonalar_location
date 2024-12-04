import React, { useState } from "react";

function LocationFinder() {
  const [location, setLocation] = useState(""); // Hudud nomi
  const [coordinates, setCoordinates] = useState(null); // Koordinatalar
  const [error, setError] = useState(null); // Xatolik

  const API_KEY = "SIZNING_API_KALITINGIZ"; // Google API kalitingizni kiriting

  const handleSearch = async () => {
    if (!location) {
      setError("Hudud nomini kiriting!");
      return;
    }

    try {
      setError(null); // Xatolikni tozalash
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
      } else {
        setError(`Hudud topilmadi: ${data.status}`);
      }
    } catch (err) {
      setError("Ma'lumot olishda xatolik yuz berdi.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Hudud lokatsiyasini toping</h2>
      <input
        type="text"
        placeholder="Hudud nomini kiriting"
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

      {coordinates && (
        <div style={{ marginTop: "20px" }}>
          <h3>Koordinatalar:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
}

export default LocationFinder;
