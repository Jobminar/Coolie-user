import { toast } from "react-toastify";

export const saveAddress = async (addressData) => {
  try {
    console.log("Sending address data to API:", addressData);
    const response = await fetch(
      "https://api.coolieno1.in/v1.0/users/user-address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(addressData),
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Response from API:", data);
      toast.success("Address saved successfully!");
      return data;
    } else {
      const errorData = await response.json();
      console.error("Failed to save address:", errorData);

      switch (response.status) {
        case 400:
          toast.error(`Validation error: ${errorData.message}`);
          break;
        case 401:
          toast.error("Unauthorized: Please login again.");
          break;
        case 500:
          toast.error("Internal server error: Please try again later.");
          break;
        default:
          toast.error(`Failed to save address: ${errorData.message}`);
      }

      throw new Error(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during saving address:", error);
    toast.error(`Error during saving address: ${error.message}`);
    throw error;
  }
};

export const getSavedAddresses = async (userId) => {
  try {
    console.log("Fetching saved addresses for userId:", userId);
    const response = await fetch(
      `https://api.coolieno1.in/v1.0/users/user-address/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched saved addresses:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch saved addresses:", errorData);
      toast.error(`Failed to fetch saved addresses: ${errorData.message}`);
      throw new Error(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during fetching saved addresses:", error);
    toast.error(`Error during fetching saved addresses: ${error.message}`);
    throw error;
  }
};
