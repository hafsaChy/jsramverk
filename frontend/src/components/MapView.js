import io from 'socket.io-client'
import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import markerImg from '../icon/location.png'

const MapView = () => {
  const mapRef = useRef(null);
  const markers = useRef({});

  useEffect(() => {
    const map = L.map('map').setView([62.173276, 14.942265], 5);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const socket = io("http://localhost:1337");

    socket.on("message", (data) => {
      if (markers.current.hasOwnProperty(data.trainnumber)) {
        const marker = markers.current[data.trainnumber];
        marker.setLatLng(data.position);
      } else {
        let customIcon = L.icon({
          iconUrl: icon,
          iconSize: [32, 32],
          shadowUrl: iconShadow,
        })
        const marker = L.marker(data.position, { icon: customIcon }).bindPopup(data.trainnumber).addTo(map);
        markers.current[data.trainnumber] = marker;
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return (<div id="map" className="map"></div>);
}

export default MapView;
