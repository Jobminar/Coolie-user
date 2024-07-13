// src/components/Address.jsx

import React, { useState } from "react";
import LocationModal from "./LocationModal";
import "./Address.css";

const Address = ({ onNext }) => {
  const [addressData, setAddressData] = useState({
    bookingType: "self",
    mobileNumber: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    state: "",
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
    // Call API to submit data or move to next step
    onNext("schedule"); // Triggering the next step
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
          />{" "}
          My Self
        </label>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="others"
            checked={addressData.bookingType === "others"}
            onChange={handleChange}
          />{" "}
          Booking for Others
        </label>
      </div>
      <div className="location-options">
        <p onClick={() => setShowModal(true)} className="location-option">
          📍 Choose Location
        </p>
      </div>
      <div className="address-form">
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile number"
          value={addressData.mobileNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address (House#, Street)"
          value={addressData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={addressData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={addressData.pincode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="landmark"
          placeholder="Landmark (Optional)"
          value={addressData.landmark}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={addressData.state}
          onChange={handleChange}
        />
        <button className="schedule-visit-btn" onClick={handleSubmit}>
          SCHEDULE YOUR VISIT
        </button>
      </div>
      {showModal && (
        <LocationModal
          onClose={() => setShowModal(false)}
          onLocationSelect={(location) => {
            setAddressData((prevState) => ({
              ...prevState,
              address: location.address,
              city: location.city,
              pincode: location.pincode,
              state: location.state,
            }));
          }}
        />
      )}
    </div>
  );
};

export default Address;
