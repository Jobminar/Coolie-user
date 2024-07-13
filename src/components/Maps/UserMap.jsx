// src/Maps/UserMap.jsx

import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./UserMap.css";

const UserMap = ({ onLocationSelect, initialLocation }) => {
  const MapKey = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = MapKey;

    const initMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialLocation || [77.209, 28.613], // Default to Delhi
      zoom: 9,
    });

    const initMarker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(initialLocation || [77.209, 28.613])
      .addTo(initMap);

    initMarker.on("dragend", () => {
      const lngLat = initMarker.getLngLat();
      onLocationSelect(lngLat);
    });

    setMap(initMap);
    setMarker(initMarker);

    return () => initMap.remove();
  }, [initialLocation, MapKey, onLocationSelect]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default UserMap;
