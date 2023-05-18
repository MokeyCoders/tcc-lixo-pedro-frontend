import axios from 'axios'; // inside .js file

// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import 'leaflet-defaulticon-compatibility';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
