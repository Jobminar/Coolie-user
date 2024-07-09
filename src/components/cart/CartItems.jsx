import React, { useContext, useEffect,useState } from "react";
import { CartContext } from "../../context/CartContext";
import deleteIcon from "../../assets/images/Delete.png";
import "./CartItems.css";

const CartItems = ({ onNext }) => {
  const { removeFromCart, updateQuantity, totalPrice } =
    useContext(CartContext);

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
  return (
    <div className="cart-items">
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="item-details">
            <h4>{item.name}</h4>
            <div className="item-meta">
              <p>
                {item.duration} min | {item.quantity} Item
              </p>
            </div>
          </div>
          <div className="item-actions">
            <p className="item-price">₹ {item.price}</p>
            <div className="quantity-control">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="delete-button"
              onClick={() => removeFromCart(item.id)}
            >
              <img src={deleteIcon} alt="Delete" />
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <p>Total Price: ₹{totalPrice}</p>
      </div>
      <button className="go-to-address-btn" onClick={() => onNext("address")}>
        Go to Address
      </button>
    </div>
  );
};

export default CartItems;
