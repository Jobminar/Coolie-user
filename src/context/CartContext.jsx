import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartId, setCartId] = useState("");
  const [userIdToRemoveItem, setUserIdToRemoveItem] = useState("");
  const [itemIdToRemove, setItemIdToRemove] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632",
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
  }, []);

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

  // remove dayta from cart

  // setCartItems((prevItems) => {
  //   const newItems = prevItems
  //     .map((cart) => ({
  //       ...cart,
  //       items: cart.items.filter((item) => item._id !== itemId),
  //     }))
  //     .filter((cart) => cart.items.length > 0);
  //   calculateTotalPrice(newItems);
  //   return newItems;
  // });

  const removeFromCart = (userId, itemId) => {
    console.log(userId, itemId, "cart item id");
    setItemIdToRemove(itemId);
    setUserIdToRemoveItem(userId);
  };

  useEffect(() => {
    if (itemIdToRemove !== null) {
      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/delete-cart-item/${userIdToRemoveItem}${itemIdToRemove}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            alert("item del");
            setCartItems((prevItems) =>
              prevItems.filter((item) => item.id !== itemIdToRemove),
            );
          } else {
            console.error("Error deleting cart item:", response.statusText);
          }
        })
        .catch((error) => console.error("Error deleting cart item:", error));
    }
  }, [itemIdToRemove, userIdToRemoveItem]);

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
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
