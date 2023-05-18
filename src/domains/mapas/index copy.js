/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
import React, { useState } from 'react';

import { Space } from 'antd';
import L from 'leaflet';
import {
  LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import pin from '../../assets/pin.svg';
import { getAllTombosWhitArea } from '../../services/tombo-service';
import LeafletRuler from './LeafletRuler.jsx';
import { addressPoints } from './realworld';

const position = [-24.0438, -52.3811];

const iconPin = new L.Icon({
  iconUrl: pin,
  iconRetinaUrl: pin,
  iconSize: new L.Point(20, 40),
});

const { BaseLayer } = LayersControl;

const MapasPage = () => {
  const tiles = [
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      name: 'OpenStreetMap',
    },
    {
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      name: 'CyclOSM',
    },
    {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      name: 'Humanitarian',
    },
    {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      name: 'Topo Map',
    },
    {
      // eslint-disable-next-line max-len
      url: 'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg',
      name: 'NASA Gibs Blue Marble',
      attribution: '&copy; NASA Blue Marble, image service by OpenGeo',
    },
  ];
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const [tombos, setTombos] = useState(null);
  const [total, setTotal] = useState(0);
  const [searchArea, setSearchArea] = useState(null);

  function RequestAfterZoom() {
    const [zoomLevel, setZoomLevel] = useState(5);
    const map = useMap();
    const mapEvents = useMapEvents({
      zoomend: async () => {
        const currentZoom = mapEvents.getZoom();
        setZoomLevel(currentZoom);
        const bounds = map.getBounds();
        map.fitBounds(bounds);
        setSearchArea(bounds);
        // TODO refatorar
        const topRight1 = { lat: bounds._northEast.lat, lng: bounds._northEast.lng };
        const bottomLeft2 = { lat: bounds._southWest.lng, lng: bounds._southWest.lng };
        const topLeft3 = { lat: topRight1.lat, lng: bottomLeft2.lng };
        const bottomRight4 = { lat: bottomLeft2.lat, lng: topRight1.lng };
        const data = await getAllTombosWhitArea(
          {
            lat1: topRight1.lat,
            lgn1: topRight1.lng,
            lat2: bottomLeft2.lat,
            lgn2: bottomLeft2.lng,
            lat3: topLeft3.lat,
            lgn3: topLeft3.lng,
            lat4: bottomRight4.lat,
            lgn4: bottomRight4.lng,
          },
        );
        setTombos(data);
        setTotal(data.length);
      },
    });
    // return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom
      style={{ height: '80vh' }}
    >
      <LayersControl>
        {tiles.map((tile, index) => (
          <BaseLayer checked={index === 0} name={tile.name}>
            <TileLayer
              attribution={tile?.attribution ? tile.attribution : attribution}
              url={tile.url}
              maxZoom={18}
            />
          </BaseLayer>
        ))}
      </LayersControl>

      <RequestAfterZoom />
      {total < 2100 && tombos?.map(tombo => (
        <Marker icon={iconPin} position={[tombo[0], tombo[1]]}>
          <Popup>
            <Space>{`HCF-${tombo[2]}`}</Space>
          </Popup>
        </Marker>
      ))}

      <LeafletRuler />
    </MapContainer>
  );
};

export default MapasPage;
