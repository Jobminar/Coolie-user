import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./Address.css";
import LocationModal from "./LocationModal"; // Ensure LocationModal is properly imported

const Address = ({ onNext }) => {
  const [cookies, setCookie] = useCookies(["location"]);
  const initialLocation = cookies.location || {};
  const [addressData, setAddressData] = useState({
    bookingType: "self",
    mobileNumber: "",
    address: "",
    city: initialLocation.city || "",
    pincode: initialLocation.pincode || "",
    landmark: initialLocation.landmark || "",
    state: initialLocation.state || "",
    latitude: initialLocation.latitude || 0,
    longitude: initialLocation.longitude || 0,
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Address Data:", addressData);
    onNext("schedule");
  };

  useEffect(() => {
    setCookie(
      "location",
      {
        city: addressData.city,
        pincode: addressData.pincode,
        state: addressData.state,
        landmark: addressData.landmark,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
      { path: "/" },
    );
  }, [addressData, setCookie]);

  const parseAddress = (addressString) => {
    const parts = addressString.split(", ");
    return {
      address: parts.slice(0, 2).join(", "), // "Street Number 2, Jal Vayu Vihar"
      pincode: parts[2], // "500072"
      city: "Hyderabad", // Always "Hyderabad"
      landmark: "Medchal-Malkajgiri", // Always "Medchal-Malkajgiri"
      state: parts[6] || "Telangana", // "Telangana"
    };
  };

  const handleLocationSelect = (location) => {
    const parsedAddress = parseAddress(location.address);
    setAddressData((prevState) => ({
      ...prevState,
      ...parsedAddress,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  return (
    <div className="address-container">
      <h3>Current Location</h3>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="bookingType"
            value="self"
            checked={addressData.bookingType === "self"}
            onChange={handleChange}
          />
          My Self
        </label>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="others"
            checked={addressData.bookingType === "others"}
            onChange={handleChange}
          />
          Booking for Others
        </label>
      </div>
      <div className="location-options">
        <p onClick={() => setShowModal(true)} className="location-option">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> Choose Location
        </p>
      </div>
      <div className="address-form">
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobileNumber"
            value={addressData.mobileNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={addressData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={addressData.city}
            onChange={handleChange}
          />
        </label>
        <label>
          Pincode:
          <input
            type="text"
            name="pincode"
            value={addressData.pincode}
            onChange={handleChange}
          />
        </label>
        <label>
          Landmark:
          <input
            type="text"
            name="landmark"
            value={addressData.landmark}
            onChange={handleChange}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={addressData.state}
            onChange={handleChange}
          />
        </label>
        <label>
          Latitude:
          <input
            type="text"
            name="latitude"
            value={addressData.latitude}
            readOnly
          />
        </label>
        <label>
          Longitude:
          <input
            type="text"
            name="longitude"
            value={addressData.longitude}
            readOnly
          />
        </label>
        <button className="schedule-visit-btn" onClick={handleSubmit}>
          SCHEDULE YOUR VISIT
        </button>
      </div>
      {showModal && (
        <LocationModal
          onClose={() => setShowModal(false)}
          onLocationSelect={handleLocationSelect}
          lat={addressData.latitude || 0} // Default to 0 if no lat/lon available
          lng={addressData.longitude || 0}
        />
      )}
    </div>
  );
};

export default Address;
