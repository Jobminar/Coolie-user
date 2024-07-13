// src/hooks/useUserLocation.js

import { useGeolocated } from "react-geolocated";

const useUserLocation = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  if (!isGeolocationAvailable) {
    console.error("Geolocation is not supported by this browser.");
    return null;
  }

  if (!isGeolocationEnabled) {
    console.error("Geolocation is not enabled.");
    return null;
  }

  if (coords) {
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  }

  return null;
};

export default useUserLocation;
