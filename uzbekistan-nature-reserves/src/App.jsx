import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../src/App.css";

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
  
  {
    id: 6,
    name: "Hisor davlat qo‘riqxonasi ",
    description: "https://eco.gov.uz/en/site/news?id=2040",
    region: "Qashqadaryo viloyati",
    lat:38.4750,
    lon: 67.1530,
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
  const [userLocation, setUserLocation] = useState({
    lat: 41.2995,
    lon: 69.2401,
  }); // Default Toshkent koordinatalari
  const [distances, setDistances] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    // Har bir qo'riqxonaga bo'lgan masofani hisoblash
    const calculatedDistances = parks.map((park) => {
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lon,
        park.lat,
        park.lon
      );
      return { name: park.name, distance: distance.toFixed(2) };
    });
    setDistances(calculatedDistances);
  }, [userLocation]);

  return (
    <div className="App">
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <h2 className="HeaderP">
              O‘zbekistonning Muhoafaza Qilingan Hududlari
            </h2>
            <p>
              Hozirgi joylashuvingiz: {userLocation.lat.toFixed(2)},{" "}
              {userLocation.lon.toFixed(2)}
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
                    {selectedPark.region}.
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    lat:{selectedPark.lat}° N <br />
                    lon:{selectedPark.lon}° E
                  </Card.Subtitle>
                  <a
                    href={selectedPark.description}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Batafsil ma'lumot
                  </a>
                </Card.Body>
              </Card>
            )}

            <div>
              <h5>
                Siz turgan hududdan har bir qo'riqxonagacha bo'lgan masofa:
              </h5>
              <ul className="hududUl">
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
              center={[userLocation.lat, userLocation.lon]}
              zoom={6}
              className="maps"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedPark && (
                <Marker position={[selectedPark.lat, selectedPark.lon]}>
                  <Popup>
                    <strong>{selectedPark.name}</strong>
                    <br />
                    <a
                      href={selectedPark.description}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Batafsil ma'lumot
                    </a>
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
