import { useEffect } from 'react';

import L from 'leaflet';
import { useMap } from 'react-leaflet';
import './leaflet-ruler.scss';
import './leaflet-ruler';

export default function LeafletRuler() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    L.control.ruler().addTo(map);
  }, [map]);

  return null;
}
