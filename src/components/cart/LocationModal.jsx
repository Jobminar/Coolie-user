import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./LocationModal.css"; // Ensure to create appropriate styles
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext
import markerImage from "../../assets/images/user-marker.gif"; // Import the marker image
import {
  FaMapMarkerAlt,
  FaRegCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"; // Import icons

// Set your Mapbox access token from environment variables using Vite's method
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LocationModal = ({ onClose, onLocationSelect, lat, lng }) => {
  const { userLocation } = useAuth(); // Get userLocation from context
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null); // State to manage the popup
  const [currentLng, setCurrentLng] = useState(
    parseFloat(sessionStorage.getItem("markedLng")) || lng,
  );
  const [currentLat, setCurrentLat] = useState(
    parseFloat(sessionStorage.getItem("markedLat")) || lat,
  );
  const [zoom, setZoom] = useState(12); // Adjusted zoom level for better initial focus
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to manage API calls
  const [tempLocation, setTempLocation] = useState({
    latitude: currentLat,
    longitude: currentLng,
  });

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`,
      );
      const data = await response.json();
      if (data.features.length > 0) {
        return data.features[0].place_name;
      }
      return "Unknown location";
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "Error fetching address";
    }
  };

  const updateLocation = async (latitude, longitude) => {
    const fetchedAddress = await fetchAddress(latitude, longitude);
    setAddress(fetchedAddress);
  };

  const handleUseCurrentLocation = async () => {
    const { latitude, longitude } = userLocation;
    setLoading(true);
    setTempLocation({ latitude, longitude });
    sessionStorage.removeItem("markedLat");
    sessionStorage.removeItem("markedLng");
    await reloadMap(latitude, longitude);
    await updateLocation(latitude, longitude);
    onLocationSelect({
      address,
      city: "Current City",
      pincode: "00000",
      state: "Current State",
      latitude,
      longitude,
    });
    setLoading(false);
  };

  const handleUseMarkedLocation = async () => {
    const { latitude, longitude } = tempLocation;
    if (popup) {
      popup.remove(); // Remove any existing popup
    }
    setLoading(true);
    const fetchedAddress = await fetchAddress(latitude, longitude);
    const newPopup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat([latitude, longitude])
      .setHTML(`<p><strong>Address:</strong> ${fetchedAddress}</p>`)
      .addTo(map);
    setPopup(newPopup); // Set the new popup to state
    sessionStorage.setItem("markedLat", latitude);
    sessionStorage.setItem("markedLng", longitude);
    setCurrentLng(longitude);
    setCurrentLat(latitude);
    onLocationSelect({
      address: fetchedAddress,
      city: "Marked City",
      pincode: "00000",
      state: "Marked State",
      latitude,
      longitude,
    });
    setAddress(fetchedAddress);
    setLoading(false);
  };

  const reloadMap = async (latitude, longitude) => {
    if (map) {
      map.remove();
      setMap(null);
    }

    const mapContainer = document.createElement("div");
    mapContainer.id = "map-container"; // Set an id for the map container
    mapContainer.style.height = "100%";
    mapContainer.style.width = "100%";
    document.getElementById("map").appendChild(mapContainer);

    const newMap = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11", // Mapbox street style map
      center: [longitude, latitude],
      zoom: zoom,
    });

    newMap.on("load", async () => {
      setMap(newMap);
      newMap.resize();

      // Add a marker to the map
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        element: document.createElement("div"),
      })
        .setLngLat([longitude, latitude])
        .addTo(newMap);

      const markerElement = newMarker.getElement();
      markerElement.style.backgroundImage = `url(${markerImage})`;
      markerElement.style.width = "50px";
      markerElement.style.height = "50px";
      markerElement.style.backgroundSize = "100%";

      // Event listener for marker drag end
      newMarker.on("dragend", async () => {
        const lngLat = newMarker.getLngLat();
        setTempLocation({ latitude: lngLat.lat, longitude: lngLat.lng });
        await updateLocation(lngLat.lat, lngLat.lng);
      });

      setMarker(newMarker);

      // Fetch initial address
      await updateLocation(latitude, longitude);
    });

    // Add map click event
    newMap.on("click", async (e) => {
      const longitude = e.lngLat.lng;
      const latitude = e.lngLat.lat;
      setTempLocation({ latitude, longitude });

      // Move the marker to the clicked position
      if (marker) {
        marker.setLngLat([longitude, latitude]);
      }
      await updateLocation(latitude, longitude);
    });
  };

  useEffect(() => {
    reloadMap(currentLat, currentLng);
  }, [currentLng, currentLat, zoom]);

  useEffect(() => {
    if (userLocation) {
      updateLocation(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  return (
    <div className="location-modal">
      <div className="modal-content">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <div className="header">
          <div className="location-info">
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Latitude:</strong> {currentLat}
            </p>
            <p>
              <strong>Longitude:</strong> {currentLng}
            </p>
          </div>
          <button onClick={() => onClose()} className="close-button">
            <FaTimesCircle />
          </button>
        </div>
        <div className="body">
          <div className="instructions">
            <p>
              <strong>Welcome!</strong> You can use this map to set your
              location. Drag the marker to your desired location or click on the
              map to place the marker. You can also use your current location or
              the marked location.
            </p>
            <p>
              <strong>Use Current Location:</strong> This will reset the marker
              to your current location as detected by your device.
            </p>
            <p>
              <strong>Use Marked Location:</strong> This will use the location
              set by the marker on the map.
            </p>
            <div className="location-buttons">
              <button
                onClick={handleUseCurrentLocation}
                className="use-location-button"
                disabled={loading}
              >
                <FaMapMarkerAlt /> Use Current Location
              </button>
              <button
                onClick={handleUseMarkedLocation}
                className="use-location-button"
                disabled={loading}
              >
                <FaRegCheckCircle /> Use Marked Location
              </button>
            </div>
          </div>

          <div id="map" className="map-container"></div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
