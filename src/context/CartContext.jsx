import React, { createContext, useState, useEffect, useCallback } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children, cartId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);
  const [cartNotFound, setCartNotFound] = useState(false);
  const [cartMessage, setCartMessage] = useState(""); // New state variable
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      fetchCart();
    }
  }, [user, cartId]);

  useEffect(() => {
    calculateTotalPrice(cartItems);
    calculateTotalItems(cartItems);
  }, [cartItems]);

  const fetchCart = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${user._id}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setCartNotFound(true);
        }
        throw new Error("Failed to fetch cart data");
      }
      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const calculateTotalPrice = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (total, cart) =>
        total +
        (Array.isArray(cart.items) ? cart.items : []).reduce(
          (subTotal, item) =>
            subTotal +
            parseFloat(item.serviceId.serviceVariants[0].price) * item.quantity,
          0,
        ),
      0,
    );
    setTotalPrice(total);
  }, []);

  const calculateTotalItems = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (total, cart) =>
        total + (Array.isArray(cart.items) ? cart.items : []).length,
      0,
    );
    setTotalItems(total);
  }, []);

  const addToCart = async (item) => {
    confirmAlert({
      title: "Confirm to add",
      message: "Are you sure you want to add this item to the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await fetch(
                "https://api.coolieno1.in/v1.0/users/cart/create-cart",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(item),
                },
              );

              if (response.ok) {
                await fetchCart(); // Re-fetch cart items after adding new item
              } else {
                console.error(
                  "Failed to add item to cart:",
                  response.statusText,
                );
              }
            } catch (error) {
              console.error("Error adding item to cart:", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => console.log("Add to cart canceled"),
        },
      ],
    });
  };

  const removeFromCart = (itemId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to remove this item from the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setItemIdToRemove(itemId);
          },
        },
        {
          label: "No",
          onClick: () => console.log("Delete from cart canceled"),
        },
      ],
    });
  };

  useEffect(() => {
    if (itemIdToRemove !== null) {
      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${user._id}/${itemIdToRemove}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            setCartItems((prevItems) => {
              const newItems = prevItems
                .map((cart) => ({
                  ...cart,
                  items: (Array.isArray(cart.items) ? cart.items : []).filter(
                    (item) => item._id !== itemIdToRemove,
                  ),
                }))
                .filter((cart) => cart.items.length > 0);
              return newItems;
            });
          } else {
            console.error("Error deleting cart item:", response.statusText);
          }
        })
        .catch((error) => console.error("Error deleting cart item:", error));
    }
  }, [itemIdToRemove, user]);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((cart) => ({
        ...cart,
        items: (Array.isArray(cart.items) ? cart.items : []).map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      }));
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
        calculateTotalPrice,
        calculateTotalItems,
        fetchCart,
        cartMessage, // Make cartMessage available in the context
      }}
    >
      {cartNotFound && <div>{cartMessage}</div>}
      {children}
    </CartContext.Provider>
  );
};
