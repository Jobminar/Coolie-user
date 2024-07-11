import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children, cartId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);



// fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setCartItems(data);
        calculateTotalPrice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [cartId]);

  useEffect(() => {
    calculateTotalPrice(cartItems);
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
    setTotalPrice(total);
  };



  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems, item];
      calculateTotalPrice(newItems);
      return newItems;
    });
  };



  // delete cart items
  const removeFromCart = (itemId) => {
    console.log(itemId, 'itemId')
    setItemIdToRemove(itemId)
  };

  useEffect(() => {
    if (itemIdToRemove !== null) {
      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632/${itemIdToRemove}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            alert('item deleted')
            setCartItems((prevItems) => {
              const newItems = prevItems
                .map((cart) => ({
                  ...cart,
                  items: cart.items.filter(
                    (item) => item._id !== itemIdToRemove,
                  ),
                }))
                .filter((cart) => cart.items.length > 0);
              calculateTotalPrice(newItems);
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
    setCartItems((prevItems) => {
      const newItems = prevItems.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      }));
      calculateTotalPrice(newItems);
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
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
