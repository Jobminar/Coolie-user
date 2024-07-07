import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./CartSummary.css";
import cartIcon from "../../assets/images/cart.png";
import locationMarker from "../../assets/images/location-marker.png";
import calendarIcon from "../../assets/images/calender.png";
import checkoutIcon from "../../assets/images/checkout.png";
import deleteIcon from "../../assets/images/Delete.png";

const CartSummary = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } =
    useContext(CartContext);

  return (
    <div className="cart-summary">
      <div className="cart-steps">
        <div className="step">
          <img src={cartIcon} alt="Cart" />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className="badge">{cartItems.length}</span>
          )}
        </div>
        <div className="step">
          <img src={locationMarker} alt="Address" />
          <span>Address</span>
        </div>
        <div className="step">
          <img src={calendarIcon} alt="Schedule" />
          <span>Schedule</span>
        </div>
        <div className="step">
          <img src={checkoutIcon} alt="Checkout" />
          <span>Checkout</span>
        </div>
      </div>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
              <p>
                {item.duration} min | {item.quantity} Item
              </p>
            </div>
            <div className="item-actions">
              <div className="quantity-control">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
              <button onClick={() => removeFromCart(item.id)}>
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <p>{cartItems.length} Items</p>
        <p>₹ {totalPrice}</p>
      </div>
      <button className="confirm-button">Confirm Address</button>
    </div>
  );
};

export default CartSummary;
