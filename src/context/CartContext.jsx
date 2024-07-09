import React, { createContext, useState, useEffect } from "react";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchcart = ()=>{
      try{
             const responce = fetch('https://api.coolieno1.in/v1.0/users/cart/668bc5a39ea9a691fe736632')
             if(!responce.ok){
              throw new Error('failed to fetch cart data')
             }
             const data = responce.json()
             setCartItems(data)
             console.log(data,'cart items')
      }
      catch(err){
          console.log(err)
      }
    }
    fetchcart()
    // setCartItems(cartData.cartItems);
  }, []);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        setCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
