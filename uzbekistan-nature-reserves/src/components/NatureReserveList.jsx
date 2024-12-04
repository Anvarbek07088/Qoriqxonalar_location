import React from 'react';

const reserves = [
  { name: 'Zarafshan Qoʻriqxonasi', description: 'Oʻrta Osiyoning qadimiy tabiatini saqlash.', location: { lat: 39.654, lng: 64.56 } },
  { name: 'Chatqol Biosfera Qoʻriqxonasi', description: 'Oʻzbekistonning yuqori togʻ tabiatini himoya qilish.', location: { lat: 41.22, lng: 70.12 } },
  // Qo'shimcha qo'riqxonalarni qo'shing
];

function NatureReserveList() {
  return (
    <section>
      <h2>Qo'riqxonalar ro'yxati</h2>
      <ul>
        {reserves.map((reserve, index) => (
          <li key={index}>
            <h3>{reserve.name}</h3>
            <p>{reserve.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NatureReserveList;
