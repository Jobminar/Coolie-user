import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children, cartId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0); // New state for total items
  const [itemIdToRemove, setItemIdToRemove] = useState(null);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log("Fetching cart data...");
        const response = await fetch(
          `https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        console.log("Fetched cart data:", data);
        setCartItems(data);
        calculateTotalPrice(data);
        calculateTotalItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [cartId]);

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
    calculateTotalPrice(cartItems);
    calculateTotalItems(cartItems);
  }, [cartItems]);

  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce(
      (total, cart) =>
        total +
        cart.items.reduce(
          (subTotal, item) =>
            subTotal +
            parseFloat(item.serviceId.serviceVariants[0].price) * item.quantity,
          0,
        ),
      0,
    );
    console.log("Calculated total price:", total);
    setTotalPrice(total);
  };

  const calculateTotalItems = (cartItems) => {
    const total = cartItems.reduce(
      (total, cart) => total + cart.items.length,
      0,
    );
    console.log("Calculated total items:", total);
    setTotalItems(total);
  };

  const addToCart = (item) => {
    console.log("Adding item to cart:", item);
    setCartItems((prevItems) => {
      const newItems = [...prevItems, item];
      console.log("New cart items after adding:", newItems);
      calculateTotalPrice(newItems);
      calculateTotalItems(newItems);
      return newItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    console.log("Removing item from cart:", itemId);
    setItemIdToRemove(itemId);
  };

  useEffect(() => {
    if (itemIdToRemove !== null) {
      console.log("Deleting item from cart:", itemIdToRemove);
      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632/${itemIdToRemove}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            console.log("Item deleted successfully:", itemIdToRemove);
            setCartItems((prevItems) => {
              const newItems = prevItems
                .map((cart) => ({
                  ...cart,
                  items: cart.items.filter(
                    (item) => item._id !== itemIdToRemove,
                  ),
                }))
                .filter((cart) => cart.items.length > 0);
              console.log("New cart items after deletion:", newItems);
              calculateTotalPrice(newItems);
              calculateTotalItems(newItems);
              return newItems;
            });
          } else {
            console.error("Error deleting cart item:", response.statusText);
          }
        })
        .catch((error) => console.error("Error deleting cart item:", error));
    }
  }, [itemIdToRemove]);

  const updateQuantity = (itemId, newQuantity) => {
    console.log(
      "Updating quantity for item:",
      itemId,
      "New quantity:",
      newQuantity,
    );
    setCartItems((prevItems) => {
      const newItems = prevItems.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      }));
      console.log("New cart items after quantity update:", newItems);
      calculateTotalPrice(newItems);
      calculateTotalItems(newItems);
      return newItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
