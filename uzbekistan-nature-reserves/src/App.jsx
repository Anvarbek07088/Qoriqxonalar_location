import { useState } from "react"; // React'dan faqat kerakli hook'larni import qildim
import { Link, NavLink } from "react-router-dom";
import "./App.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";

import "leaflet/dist/leaflet.css";

// Qo'riqxonalar va tabiiy hududlar ma'lumotlari
const parks = [
  {
    id: 1,
    name: "Chotqol davlat biosfera qo‘riqxonasi",
    description: "https://uzbekistan.travel/uz/o/chotqol-biosfera-qoriqxonasi/",
    region: "Toshkent viloyati",
    lat: 41.55,
    lon: 69.2,
  },
  {
    id: 2,
    name: "Zomin davlat qo‘riqxonasi",
    description: "https://gov.uz/oz/eco/news/view/22746",
    region: "Jizzax viloyati",
    lat: 40.98,
    lon: 67.97,
  },
  {
    id: 3,
    name: "Nurota davlat qo‘riqxonasi",
    description: "https://meros.uz/object/nurota-davlat-qoriqxonasi",
    region: "Jizzax viloyati",
    lat: 40.7,
    lon: 67.67,
  },
  {
    id: 4,
    name: "Qizilqum davlat qo‘riqxonasi",
    description: "https://uzbekistan.travel/uz/o/qizilqum-qoriqxonasi/",
    region: "Buxoro, Xorazim viloyati",
    lat: 40.3667,
    lon: 64.0,
  },
  {
    id: 5,
    name: "Surxon davlat qo‘riqxonasi",
    description: "https://uzbekistan.travel/uz/o/surxon-qoriqxonasi/",
    region: "Surxandaryo viloyati",
    lat: 37.8,
    lon: 67.5,
  },
];

// Haversine formula
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

function App() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 0, lon: 0 });
  const [distances, setDistances] = useState([]);

  useState(() => {
    // Geolokatsiyani olish
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useState(() => {
    // Har bir qo'riqxonaga bo'lgan masofani hisoblash
    if (userLocation.lat !== 0 && userLocation.lon !== 0) {
      const distances = parks.map((park) => {
        const distance = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          park.lat,
          park.lon
        );
        return { name: park.name, distance: distance.toFixed(2) };
      });
      setDistances(distances);
    }
  }, [userLocation]);

  return (
    <div className="App">
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <h2>O‘zbekistonning Muhoafaza Qilingan Hududlari</h2>
            <p>
              Hozirgi joylashuvingiz:{" "}
              {userLocation.lat
                ? `${userLocation.lat.toFixed(2)}, ${userLocation.lon.toFixed(
                    2
                  )}`
                : "Yuklanmoqda..."}
            </p>

            <select
              className="form-select mb-4"
              onChange={(e) =>
                setSelectedPark(
                  parks.find((park) => park.id === parseInt(e.target.value))
                )
              }
            >
              <option value="">Qo'riqxonani tanlang</option>
              {parks.map((park) => (
                <option key={park.id} value={park.id}>
                  {park.name}
                </option>
              ))}
            </select>

            {selectedPark && (
              <Card>
                <Card.Body>
                  <Card.Title>{selectedPark.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {selectedPark.region}
                  </Card.Subtitle>
                  <a
                    href={selectedPark.description}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPark.description}
                  </a>
                </Card.Body>
              </Card>
            )}

            <div>
              <h5>Har bir qo'riqxonaga bo'lgan masofa:</h5>
              <ul>
                {distances.map((dist, index) => (
                  <li key={index}>
                    {dist.name}: {dist.distance} km
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col md={8}>
            <MapContainer
              center={[
                userLocation.lat || 41.2995,
                userLocation.lon || 69.2401,
              ]}
              zoom={6}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedPark && (
                <Marker position={[selectedPark.lat, selectedPark.lon]}>
                  <Popup>
                    <strong>{selectedPark.name}</strong>
                    <p>{selectedPark.description}</p>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
