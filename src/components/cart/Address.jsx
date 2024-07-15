import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrosshairs,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons"; // Import the save icon
import "./Address.css";
import LocationModal from "./LocationModal"; // Ensure LocationModal is properly imported
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import { saveAddress, getSavedAddresses } from "./api/address-api"; // Import API functions
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify components
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import AddressForm from "./AddressForm"; // Import AddressForm component

const Address = ({ onNext }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [cookies, setCookie] = useCookies(["location"]);
  const initialLocation = cookies.location || {};

  // Initialize addressData state with user information if available
  const [addressData, setAddressData] = useState({
    bookingType: "self",
    name: "",
    mobileNumber: sessionStorage.getItem("phone") || "",
    address: "",
    city: initialLocation.city || "Hyderabad",
    pincode: initialLocation.pincode || "500072",
    landmark: initialLocation.landmark || "Medchal-Malkajgiri",
    state: initialLocation.state || "Telangana",
    latitude: initialLocation.latitude || 0,
    longitude: initialLocation.longitude || 0,
    userId: user?._id || "", // Store user ID
  });

  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form display
  const [showSavedAddresses, setShowSavedAddresses] = useState(true); // State to toggle saved addresses display
  const [savedAddresses, setSavedAddresses] = useState([]); // State to store saved addresses
  const [selectedAddresses, setSelectedAddresses] = useState([]); // State to store selected addresses

  // Update addressData state when user object changes
  useEffect(() => {
    if (user) {
      setAddressData((prevState) => ({
        ...prevState,
        mobileNumber: sessionStorage.getItem("phone") || user.phone || "",
        userId: user._id || "",
      }));
    }
  }, [user]);

  // Fetch saved addresses when the component mounts
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (user) {
        try {
          const addresses = await getSavedAddresses(user._id);
          console.log("Fetched saved addresses:", addresses);
          if (Array.isArray(addresses)) {
            setSavedAddresses(addresses);
          } else {
            setSavedAddresses([addresses]);
          }
        } catch (error) {
          console.error("Error fetching saved addresses:", error);
        }
      }
    };
    fetchSavedAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Address Data on submit:", addressData);
    // Ensure the userId is included in the request body
    const requestBody = {
      ...addressData,
      userId: user?._id,
    };
    console.log("Request Body on submit:", requestBody);
    onNext("schedule");
  };

  const handleSaveAddress = async (addressData) => {
    try {
      console.log("Address Data before save:", addressData);
      await saveAddress(addressData);
      // Add the new address to the saved addresses list
      setSavedAddresses((prevAddresses) => [...prevAddresses, addressData]);
    } catch (error) {
      console.error("Error in handleSaveAddress:", error);
    }
  };

  const handleShowSavedAddresses = () => {
    setShowSavedAddresses(!showSavedAddresses);
  };

  const handleCheckboxChange = (address) => {
    setSelectedAddresses((prevSelected) => {
      if (prevSelected.includes(address)) {
        console.log(`Deselected address ID: ${address._id}`);
        return prevSelected.filter((item) => item !== address);
      } else {
        console.log(`Selected address ID: ${address._id}`);
        console.log("Selected address:", address);
        return [...prevSelected, address];
      }
    });
  };

  // Update cookies when addressData changes
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
      pincode: parts[2] || "", // "500072"
      city: "Hyderabad", // Always "Hyderabad"
      landmark: "Medchal-Malkajgiri", // Always "Medchal-Malkajgiri"
      state: parts[6] || "Telangana", // "Telangana"
    };
  };

  const handleLocationSelect = (location) => {
    const parsedAddress = parseAddress(location.address);
    console.log("Parsed Address from location select:", parsedAddress);
    setAddressData((prevState) => ({
      ...prevState,
      ...parsedAddress,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  return (
    <div className="address-container">
      <ToastContainer />{" "}
      {/* Add ToastContainer for displaying toast messages */}
      <p className="location-option" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faCrosshairs} /> Use Current LOCATION
      </p>
      <div
        className="toggle-saved-addresses"
        onClick={handleShowSavedAddresses}
      >
        <FontAwesomeIcon icon={faSave} /> <span>Show Saved Addresses</span>
      </div>
      {showSavedAddresses &&
        (savedAddresses.length > 0 ? (
          savedAddresses.map((address, index) => (
            <div key={index} className="saved-address">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(address)}
              />
              <p>
                <strong>Mobile:</strong> {address.mobileNumber} <br />
                <strong>Booking Type:</strong> {address.bookingType} <br />
                <strong>Address:</strong> {address.address}, {address.city},{" "}
                {address.pincode}, {address.landmark}, {address.state}
                <br />
                <span className="light-grey">
                  ID: {address._id}, Latitude: {address.latitude}, Longitude:{" "}
                  {address.longitude}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No address available</p>
        ))}
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
        <AddressForm
          addressData={addressData}
          setAddressData={setAddressData}
          handleSaveAddress={handleSaveAddress}
        />
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
