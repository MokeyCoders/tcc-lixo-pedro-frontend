/* eslint-disable react-perf/jsx-no-new-array-as-prop */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import './mapa.css';
import { useEffect, useState } from 'react';

import * as L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { addressPoints } from './realworld';

const customIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const Cluster = () => {
  const map = useMap();
  const pos = [0, 0];
  return (
    <MarkerClusterGroup>
      <Marker position={pos} title="EU" icon={customIcon} />
      {(addressPoints).map((address, index) => (
        <Marker
          key={address[2]}
          position={address}
          title={address[2]}
          icon={customIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
};

const MapasPage = () => {
  const [position, setPosition] = useState([0, 0]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        navigatorPosition => {
          const { latitude, longitude } = navigatorPosition.coords;
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

  return (
    <MapContainer
      className="markercluster-map"
      center={position}
      zoom={6}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Cluster />
      <Marker
        position={[0, 0]}
        title="LIXO"
        icon={customIcon}
      />
    </MapContainer>
  );
};

export default MapasPage;
