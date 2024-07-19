import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { CartContext } from "./CartContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext"; // Import the useAuth hook
import { useMessaging } from "./MessagingContext"; // Import the useMessaging hook

export const OrdersContext = createContext();

export const OrdersProvider = ({ children, activeTab }) => {
  const { cartItems } = useContext(CartContext);
  const { user } = useAuth(); // Get the user from AuthContext
  const { sendNotification } = useMessaging(); // Get the sendNotification function from MessagingContext
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const orderDataRef = useRef([]);
  const hasMountedRef = useRef(false); // Track whether the component has mounted

  const updateOrderDetails = (updatedDetails) => {
    setOrderDetails(updatedDetails);
  };

  const updateItemSchedule = (itemId, dateTime) => {
    const updatedOrderData = orderDataRef.current.map((cart) => ({
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId ? { ...item, ...dateTime } : item,
      ),
    }));
    orderDataRef.current = updatedOrderData;
    setOrderDetails(updatedOrderData);
  };

  const updateAllItemSchedules = (dateTime) => {
    const updatedOrderData = orderDataRef.current.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        ...dateTime,
      })),
    }));
    orderDataRef.current = updatedOrderData;
    setOrderDetails(updatedOrderData);
  };

  const updateSelectedAddressId = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const formatScheduledDate = (item) => {
    const currentDate = new Date();
    const selectedDate = item.selectedDate || currentDate.getDate();
    const selectedMonth =
      item.selectedMonth !== undefined
        ? item.selectedMonth
        : currentDate.getMonth() + 1; // getMonth() is zero-based
    const selectedYear = currentDate.getFullYear();
    const selectedTime = item.selectedTime || "Default Time";
    return `${selectedDate}-${selectedMonth}-${selectedYear} ${selectedTime}`;
  };

  const createOrder = async (paymentId) => {
    console.log("Selected AddressId:", selectedAddressId);
    console.log("Order Details:", orderDetails);

    if (!selectedAddressId || !orderDetails.length || !user?._id) {
      console.error("Missing address, cart items, or user information");
      return;
    }

    // Extracting items from orderDetails, removing the cartItems wrapper
    const items = orderDetails.flatMap((cart) =>
      cart.items.map((item) => ({
        ...item,
        scheduledDate: formatScheduledDate(item),
      })),
    );

    const orderData = {
      userId: user._id, // Include user._id in orderData
      addressId: selectedAddressId,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      items: items,
      paymentId,
    };

    console.log("Order Data:", orderData);

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (response.ok) {
        const orderResponse = await response.json();
        console.log("Order created successfully:", orderResponse);

        // Send notification using MessagingContext
        sendNotification({
          title: "Order Created",
          body: "Your order has been made and looking for service providers.",
        });

        // Show confirmation alert
        confirmAlert({
          title: "Order Created",
          message:
            "Your order has been made and looking for service providers.",
          buttons: [
            {
              label: "OK",
              onClick: () => {},
            },
          ],
        });
      } else {
        console.error("Failed to create order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Initialize orderDataRef with cartItems and extract categoryIds and subCategoryIds
  useEffect(() => {
    orderDataRef.current = cartItems;
    setOrderDetails(cartItems);

    const extractedCategoryIds = [];
    const extractedSubCategoryIds = [];
    cartItems.forEach((cart) => {
      cart.items.forEach((item) => {
        if (
          item.categoryId &&
          !extractedCategoryIds.includes(item.categoryId._id)
        ) {
          extractedCategoryIds.push(item.categoryId._id);
        }
        if (
          item.subCategoryId &&
          !extractedSubCategoryIds.includes(item.subCategoryId._id)
        ) {
          extractedSubCategoryIds.push(item.subCategoryId._id);
        }
      });
    });

    setCategoryIds(extractedCategoryIds);
    setSubCategoryIds(extractedSubCategoryIds);
    hasMountedRef.current = true; // Set the flag to true after initial mount
  }, [cartItems]);

  // Show confirmation popup when orderDetails are updated
  useEffect(() => {
    if (
      hasMountedRef.current &&
      orderDetails.length > 0 &&
      activeTab === "schedule"
    ) {
      confirmAlert({
        title: "Orders updated",
        message: "The service scheduling has been updated successfully.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
      });
    }
  }, [orderDetails, activeTab]);

  return (
    <OrdersContext.Provider
      value={{
        selectedAddressId,
        setSelectedAddressId,
        updateSelectedAddressId,
        orderDetails,
        updateOrderDetails,
        updateItemSchedule,
        updateAllItemSchedules,
        createOrder,
        categoryIds,
        subCategoryIds,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
