// src/components/LocationModal.jsx

import React, { useState, useEffect } from "react";
import UserMap from "../Maps/UserMap";
import { useAuth } from "../../context/AuthContext";
import "./LocationModal.css";

const LocationModal = ({ onClose, onLocationSelect }) => {
  const { userLocation } = useAuth();
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    if (useCurrentLocation && userLocation) {
      handleLocationSelect(userLocation);
    }
  }, [useCurrentLocation, userLocation]);

  const handleCheckboxChange = () => {
    setUseCurrentLocation((prev) => !prev);
  };

  const handleLocationSelect = async (location) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${
          location.lat
        }.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`,
      );
      const data = await response.json();
      const place = data.features[0];
      onLocationSelect({
        address: place.place_name,
        city: place.context.find((c) => c.id.includes("place")).text,
        pincode: place.context.find((c) => c.id.includes("postcode")).text,
        state: place.context.find((c) => c.id.includes("region")).text,
      });
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
    onClose();
  };

  return (
    <div className="location-modal">
      <div className="location-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h3>Choose Your Location</h3>
        <label className="current-location-checkbox">
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={handleCheckboxChange}
          />
          <p>Choose current location</p>
        </label>
        {!useCurrentLocation && (
          <UserMap onLocationSelect={handleLocationSelect} />
        )}
      </div>
    </div>
  );
};

export default LocationModal;
