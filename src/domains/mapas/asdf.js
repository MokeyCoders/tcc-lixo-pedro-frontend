import axios from 'axios';
import * as L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import './App.css';
import { useEffect, useState } from 'react';

const customIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const Recenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

function App() {
  const [points, setPoints] = useState();
  const [position, setPosition] = useState([0, 0]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://7c50-179-96-159-47.sa.ngrok.io/api/tombos/with-area',
        {
          params: {
            lat1: -24.03893911689407,
            lgn1: -52.20703125000001,
            lat2: -55.40679931640626,
            lgn2: -55.40679931640626,
            lat3: -24.03893911689407,
            lgn3: -55.40679931640626,
            lat4: -55.40679931640626,
            lgn4: -52.20703125000001,
          },
        },
      );

      const { data } = response;
      console.log(data.length);
      setPoints(data.filter(d => d.length === 3));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        error => {
          console.error('Error getting current position:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  }, []);

  const MapEvents = () => {
    const map = useMap();
    useMapEvents({
      zoomend: () => fetchData(map),
    });
    return null;
  };

  return (
    <MapContainer
      className="markercluster-map"
      center={position}
      zoom={6}
      maxZoom={18}
    >
      <Recenter lat={position[0]} lng={position[1]} />
      <MapEvents />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MarkerClusterGroup chunkedLoading>
        <Marker position={position} title="EU" icon={customIcon} />
        {(points ?? []).map((address, index) => (
          <Marker
            key={index}
            position={[address[0], address[1]]}
            title={address[2]}
            icon={customIcon}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default App;
