import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faEdit } from "@fortawesome/free-solid-svg-icons"; // Import the crosshairs icon
import "./Address.css";
import LocationModal from "./LocationModal"; // Ensure LocationModal is properly imported

const Address = ({ onNext }) => {
  const [cookies, setCookie] = useCookies(["location"]);
  const initialLocation = cookies.location || {};
  const [addressData, setAddressData] = useState({
    bookingType: "self",
    name: "",
    mobileNumber: "",
    address: "",
    city: initialLocation.city || "Hyderabad",
    pincode: initialLocation.pincode || "500072",
    landmark: initialLocation.landmark || "Medchal-Malkajgiri",
    state: initialLocation.state || "Telangana",
    latitude: initialLocation.latitude || 0,
    longitude: initialLocation.longitude || 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form display

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
      <p className="location-option" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faCrosshairs} /> Use Current LOCATION
      </p>
      <div className="radio-group">
        <p>Contact:</p>
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
      <div className="add-new-address" onClick={() => setShowForm(!showForm)}>
        <FontAwesomeIcon icon={faEdit} />
        <span>Add New Address & Mobile Number</span>
      </div>
      {showForm && (
        <div className="address-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={addressData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={addressData.mobileNumber}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="address"
            className="full-width"
            placeholder="Address (House#, Street)"
            value={addressData.address}
            onChange={handleChange}
          />
          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City / Dist"
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
          </div>
          <div className="form-row">
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
          </div>
        </div>
      )}
      <button className="schedule-visit-btn" onClick={handleSubmit}>
        SCHEDULE YOUR VISIT
      </button>
      {showModal && (
        <LocationModal
          onClose={() => setShowModal(false)}
          onLocationSelect={handleLocationSelect}
          lat={initialLocation.latitude || 0} // Default to 0 if no lat/lon available
          lng={initialLocation.longitude || 0}
        />
      )}
    </div>
  );
};

export default Address;
