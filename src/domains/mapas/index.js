/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react-perf/jsx-no-new-object-as-prop */
// /* eslint-disable react-perf/jsx-no-new-array-as-prop */
// import React, { useState } from 'react';

// import { Space } from 'antd';
// import L from 'leaflet';
// import {
//   LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents,
// } from 'react-leaflet';
// import { MarkerClusterGroup } from 'react-leaflet-cluster';

// import pin from '../../assets/pin.svg';
// import { getAllTombosWhitArea } from '../../services/tombo-service';
// import LeafletRuler from './LeafletRuler.jsx';
// import { addressPoints } from './realworld';

// const position = [-24.0438, -52.3811];

// const iconPin = new L.Icon({
//   iconUrl: pin,
//   iconRetinaUrl: pin,
//   iconSize: new L.Point(20, 40),
// });

// const { BaseLayer } = LayersControl;

// const MapasPage = () => {
//   const tiles = [
//     {
//       url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//       name: 'OpenStreetMap',
//     },
//     {
//       url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
//       name: 'CyclOSM',
//     },
//     {
//       url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
//       name: 'Humanitarian',
//     },
//     {
//       url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
//       name: 'Topo Map',
//     },
//     {
//       // eslint-disable-next-line max-len
//       url: 'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg',
//       name: 'NASA Gibs Blue Marble',
//       attribution: '&copy; NASA Blue Marble, image service by OpenGeo',
//     },
//   ];
//   const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

//   const [tombos, setTombos] = useState(null);
//   const [total, setTotal] = useState(0);
//   const [searchArea, setSearchArea] = useState(null);

//   function RequestAfterZoom() {
//     const [zoomLevel, setZoomLevel] = useState(5);
//     const map = useMap();
//     const mapEvents = useMapEvents({
//       zoomend: async () => {
//         const currentZoom = mapEvents.getZoom();
//         setZoomLevel(currentZoom);
//         const bounds = map.getBounds();
//         map.fitBounds(bounds);
//         setSearchArea(bounds);
//         // TODO refatorar
//         const topRight1 = { lat: bounds._northEast.lat, lng: bounds._northEast.lng };
//         const bottomLeft2 = { lat: bounds._southWest.lng, lng: bounds._southWest.lng };
//         const topLeft3 = { lat: topRight1.lat, lng: bottomLeft2.lng };
//         const bottomRight4 = { lat: bottomLeft2.lat, lng: topRight1.lng };
//         const data = await getAllTombosWhitArea(
//           {
//             lat1: topRight1.lat,
//             lgn1: topRight1.lng,
//             lat2: bottomLeft2.lat,
//             lgn2: bottomLeft2.lng,
//             lat3: topLeft3.lat,
//             lgn3: topLeft3.lng,
//             lat4: bottomRight4.lat,
//             lgn4: bottomRight4.lng,
//           },
//         );
//         setTombos(data);
//         setTotal(data.length);
//       },
//     });
//     // return null;
//   }

//   console.log(tombos);
//   console.log(total);

//   return (
//     <MapContainer
//       center={position}
//       zoom={14}
//       scrollWheelZoom
//       style={{ height: '80vh' }}
//     >
//       {/* <LayersControl>
//         {tiles.map((tile, index) => (
//           <BaseLayer checked={index === 0} name={tile.name}>
//             <TileLayer
//               attribution={tile?.attribution ? tile.attribution : attribution}
//               url={tile.url}
//               maxZoom={18}
//             />
//           </BaseLayer>
//         ))}
//       </LayersControl> */}

//       <MarkerClusterGroup
//         chunkedLoading
//       >
//         {(addressPoints).map((address, index) => (
//           <Marker
//             position={[address[0], address[1]]}
//             title={address[2]}
//             icon={iconPin}
//             // eslint-disable-next-line react/no-array-index-key
//             key={index}
//           />
//         ))}
//       </MarkerClusterGroup>

//       {/* <RequestAfterZoom />
//       {total < 2100 && tombos?.map(tombo => (
//         <Marker icon={iconPin} position={[tombo[0], tombo[1]]}>
//           <Popup>
//             <Space>{`HCF-${tombo[2]}`}</Space>
//           </Popup>
//         </Marker>
//       ))} */}

//       <LeafletRuler />
//     </MapContainer>
//   );
// };
import './styles.css';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, point } from 'leaflet';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

// create custom icon
const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  // eslint-disable-next-line new-cap
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  });
};

// markers
const markers = [
  {
    geocode: [51.505, -0.09],
    popUp: 'Hello, I am pop up 1',
  },
  {
    geocode: [51.504, -0.1],
    popUp: 'Hello, I am pop up 2',
  },
  {
    geocode: [51.503, -0.09],
    popUp: 'Hello, I am pop up 3',
  },
];

export default function App() {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
    >
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {/* Mapping through the markers */}
        {markers.map(marker => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}

        {/* Hard coded markers */}
        {/* <Marker position={[51.505, -0.09]} icon={customIcon}>
          <Popup>This is popup 1</Popup>
        </Marker>
        <Marker position={[51.504, -0.1]} icon={customIcon}>
          <Popup>This is popup 2</Popup>
        </Marker>
        <Marker position={[51.5, -0.09]} icon={customIcon}>
          <Popup>This is popup 3</Popup>
        </Marker>
       */}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
