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
  const { userLocation, setUserLocation } = useAuth(); // Get userLocation and setUserLocation from context
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null); // State to manage the popup
  const [currentLng, setCurrentLng] = useState(lng);
  const [currentLat, setCurrentLat] = useState(lat);
  const [zoom, setZoom] = useState(12); // Adjusted zoom level for better initial focus
  const [address, setAddress] = useState("");

  const fetchAddress = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`,
    );
    const data = await response.json();
    if (data.features.length > 0) {
      return data.features[0].place_name;
    }
    return "Unknown location";
  };

  const updateLocation = async (latitude, longitude) => {
    setCurrentLng(longitude);
    setCurrentLat(latitude);
    const fetchedAddress = await fetchAddress(latitude, longitude);
    setAddress(fetchedAddress);
  };

  const handleUseCurrentLocation = async () => {
    const { latitude, longitude } = userLocation;
    setCurrentLng(longitude);
    setCurrentLat(latitude);
    marker.setLngLat([longitude, latitude]);
    map.flyTo({ center: [longitude, latitude], zoom: 14 });

    await updateLocation(latitude, longitude);
    onLocationSelect({
      address,
      city: "Current City",
      pincode: "00000",
      state: "Current State",
      latitude,
      longitude,
    });
  };

  const handleUseMarkedLocation = async () => {
    await updateLocation(currentLat, currentLng);
    if (popup) {
      popup.remove(); // Remove any existing popup
    }
    const newPopup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat([currentLng, currentLat])
      .setHTML(`<p><strong>Address:</strong> ${address}</p>`)
      .addTo(map);
    setPopup(newPopup); // Set the new popup to state
    onLocationSelect({
      address,
      city: "Marked City",
      pincode: "00000",
      state: "Marked State",
      latitude: currentLat,
      longitude: currentLng,
    });
  };

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const newMap = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/mapbox/streets-v11", // Mapbox street style map
        center: [currentLng, currentLat],
        zoom: zoom,
      });

      newMap.on("load", () => {
        setMap(newMap);
        newMap.resize();

        // Add a marker to the map
        const newMarker = new mapboxgl.Marker({
          draggable: true,
          element: document.createElement("div"),
        })
          .setLngLat([currentLng, currentLat])
          .addTo(newMap);

        const markerElement = newMarker.getElement();
        markerElement.style.backgroundImage = `url(${markerImage})`;
        markerElement.style.width = "50px";
        markerElement.style.height = "50px";
        markerElement.style.backgroundSize = "100%";

        // Event listener for marker drag end
        newMarker.on("dragend", async () => {
          const lngLat = newMarker.getLngLat();
          await updateLocation(lngLat.lat, lngLat.lng);
        });

        // Update address while dragging the marker
        newMarker.on("drag", async () => {
          const lngLat = newMarker.getLngLat();
          const fetchedAddress = await fetchAddress(lngLat.lat, lngLat.lng);
          setAddress(fetchedAddress);
        });

        setMarker(newMarker);
      });

      // Add map click event
      newMap.on("click", async (e) => {
        const longitude = e.lngLat.lng;
        const latitude = e.lngLat.lat;
        setCurrentLng(longitude);
        setCurrentLat(latitude);

        // Move the marker to the clicked position
        if (marker) {
          marker.setLngLat([longitude, latitude]);
        }

        await updateLocation(latitude, longitude);
      });
    };

    if (!map) {
      const mapContainer = document.createElement("div");
      mapContainer.id = "map-container"; // Set an id for the map container
      mapContainer.style.height = "100%";
      mapContainer.style.width = "100%";
      document.getElementById("map").appendChild(mapContainer);
      initializeMap({ setMap, mapContainer });
    }
  }, [map, marker, currentLat, currentLng, setUserLocation, zoom]);

  useEffect(() => {
    if (userLocation) {
      updateLocation(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  return (
    <div className="location-modal">
      <div className="modal-content">
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
              >
                <FaMapMarkerAlt /> Use Current Location
              </button>
              <button
                onClick={handleUseMarkedLocation}
                className="use-location-button"
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
