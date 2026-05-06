import React, { useEffect, useMemo, useState } from 'react';

const dummyBuses = [
  { id: 'BUS-102', route: 'R12', top: '22%', left: '28%', occupancy: 62, status: 'On Time' },
  { id: 'BUS-224', route: 'R5', top: '45%', left: '61%', occupancy: 88, status: 'Crowded' },
  { id: 'BUS-077', route: 'R1', top: '67%', left: '40%', occupancy: 41, status: 'Smooth' },
  { id: 'BUS-311', route: 'R18', top: '35%', left: '78%', occupancy: 73, status: 'Moderate' }
];

const dummyCrowdHotspots = [
  { stop: 'Central Stand', level: 'High', score: 89, hint: 'Dispatch extra bus in 8 mins' },
  { stop: 'City Mall', level: 'Medium', score: 58, hint: 'Monitor crowd near exit gate' },
  { stop: 'Railway Junction', level: 'Low', score: 31, hint: 'No action needed' }
];

const dummySuggestions = [
  {
    title: 'Fastest Route Suggestion',
    detail: 'R12 buses should divert via Ring Road for the next 30 mins.',
    impact: 'Estimated delay reduction: 14%'
  },
  {
    title: 'Crowd Balancing',
    detail: 'Shift one R5 bus to Central Stand demand cluster.',
    impact: 'Expected occupancy normalization in 12 mins'
  },
  {
    title: 'Fuel Efficient Mapping',
    detail: 'Use Lake Bypass for buses heading to North Depot.',
    impact: 'Potential fuel savings: 6-8%'
  }
];

export default function IoTMonitoring() {
  const url = 'https://api.openstreetmap.org/api/0.6/map?bbox=77.28,28.58,77.55,28.80';
  const [osmPreview, setOsmPreview] = useState('Loading sample OSM XML...');

  const embedUrl = useMemo(
    () => 'https://www.openstreetmap.org/export/embed.html?bbox=77.28%2C28.58%2C77.55%2C28.80&layer=mapnik',
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchSampleMap = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        if (isMounted) {
          setOsmPreview(text.slice(0, 900));
        }
      } catch (error) {
        if (isMounted) {
          setOsmPreview('Could not fetch OSM XML sample from browser (CORS/network).');
        }
      }
    };

    fetchSampleMap();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div style={{ padding: 20 }}>
      <h2>IoT Fleet Monitoring</h2>
      <p style={{ color: '#5f6368', marginTop: 4 }}>
        OpenStreetMap Ghaziabad view with dummy bus location, crowd pressure, and route suggestions.
      </p>

      <div className="iot-layout">
        <section className="card">
          <h3 style={{ marginTop: 0 }}>Live Bus Map (Ghaziabad + Dummy Pins)</h3>
          <div className="osm-dummy-map">
            <iframe
              title="OpenStreetMap Sample"
              src={embedUrl}
              className="osm-iframe"
            />
            <div className="map-watermark">OSM bbox sample</div>

            {dummyBuses.map((bus) => (
              <div
                key={bus.id}
                className="bus-pin"
                style={{ top: bus.top, left: bus.left }}
                title={`${bus.id} | ${bus.route} | ${bus.status}`}
              >
                {bus.route}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#475467' }}>
            OSM API URL: <code>{url}</code>
          </div>
          <pre className="osm-xml-preview">{osmPreview}</pre>

          <div className="bus-chip-wrap">
            {dummyBuses.map((bus) => (
              <div key={bus.id} className="bus-chip">
                <strong>{bus.id}</strong>
                <span>{bus.route}</span>
                <span>{bus.occupancy}% occupied</span>
                <span>{bus.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Crowd Heat (Dummy)</h3>
          <div className="crowd-list">
            {dummyCrowdHotspots.map((spot) => (
              <div key={spot.stop} className="crowd-item">
                <div>
                  <strong>{spot.stop}</strong>
                  <div style={{ color: '#555', fontSize: 13 }}>{spot.hint}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`level-badge level-${spot.level.toLowerCase()}`}>{spot.level}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Load Score: {spot.score}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: 10 }}>AI Route Suggestions (Dummy)</h3>
          <div className="suggestion-list">
            {dummySuggestions.map((item) => (
              <div key={item.title} className="suggestion-item">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                <small>{item.impact}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
