import React, { useEffect, useState } from 'react';

const Addresses = () => {
  const [userId, setStoredUserId] = useState(null);
  const [addressData, setAddressesData] = useState([]);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setStoredUserId(storedUserId);
  }, [userId])

  useEffect(() => {
    if (userId) {
      const fetchAddresses = async (uid) => {
        try {
          const response = await fetch(`https://api.coolieno1.in/v1.0/users/user-address/${uid}`);

          if (response.ok) {
            const data = await response.json();
            setAddressesData(data);
          } else {
            console.error('Failed to fetch addresses:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };

      fetchAddresses(userId); // Call fetchAddresses with userId
    }
  }, [userId]);

  console.log(addressData, 'address data in address page');

  return (
    <div>
      <h2>Addresses</h2>
  
        {addressData.map((address, index) => (
          <div key={address._id} className='addresses-sub-con'>
            <div>Username: {address.username}</div>
            <div>Booking Type: {address.bookingType}</div>
            <div>Mobile Number: {address.mobileNumber}</div>
            <div>Address: {address.address}</div>
            <div>City: {address.city}</div>
            <div>Pincode: {address.pincode}</div>
            <div>Landmark: {address.landmark}</div>
            <div>State: {address.state}</div>
            <div>Latitude: {address.latitude}</div>
            <div>Longitude: {address.longitude}</div>
            <div>Created At: {new Date(address.createdAt).toLocaleString()}</div>
            <div>Updated At: {new Date(address.updatedAt).toLocaleString()}</div>
          </div>
        ))}
      
    </div>
  );
};

export default Addresses;
