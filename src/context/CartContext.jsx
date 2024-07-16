import React, { createContext, useState, useEffect, useContext } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { TailSpin } from "react-loader-spinner";
import "./CartProvider.css"; // Import the CSS file
import { useAuth } from "./AuthContext"; // Ensure you have this line to use Auth context

export const CartContext = createContext();

export const CartProvider = ({ children, cartId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartNotFound, setCartNotFound] = useState(false);
  const { user } = useAuth(); // Get the user from AuthContext

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user._id) return; // Exit if user is not available

      try {
        setLoading(true);
        console.log("Fetching cart data...");
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
        console.log("Fetched cart data:", data);
        setCartItems(data);
        calculateTotalPrice(data);
        calculateTotalItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, cartId]);

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

  const addToCart = async (item) => {
    confirmAlert({
      title: "Confirm to add",
      message: "Are you sure you want to add this item to the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setLoading(true);
            console.log("Adding item to cart:", item);
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
                const responseData = await response.json();
                setCartItems((prevItems) => {
                  const newItems = [...prevItems, responseData];
                  console.log("New cart items after adding:", newItems);
                  calculateTotalPrice(newItems);
                  calculateTotalItems(newItems);
                  return newItems;
                });
                console.log("Item added to cart:", responseData);
              } else {
                console.error(
                  "Failed to add item to cart:",
                  response.statusText,
                );
              }
            } catch (error) {
              console.error("Error adding item to cart:", error);
            } finally {
              setLoading(false);
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
            console.log("Removing item from cart:", itemId);
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
      console.log("Deleting item from cart:", itemIdToRemove);
      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${user._id}/${itemIdToRemove}`,
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
  }, [itemIdToRemove, user]);

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
      {loading && (
        <div className="loading-overlay">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      {cartNotFound && !loading && <div>No items in cart</div>}
      {!loading && children}
    </CartContext.Provider>
  );
};
