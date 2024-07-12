import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import deleteIcon from "../../assets/images/Delete.png";
import DurationLogo from "../../assets/images/timer.svg";
import "./CartItems.css";

const CartItems = ({ onNext }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } =
    useContext(CartContext);
  return (
    <div className="cart-items">
      {cartItems.map((cart) =>
        cart.items.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-details">
              <h4>{item.serviceId.name}</h4>

              <h5>
                <img src={DurationLogo} alt="clock" />:{" "}
                {item.serviceId.serviceVariants[0].serviceTime}min |
                {item.quantity} Item
              </h5>
            </div>
            <div className="item-actions">
              <p className="item-price">
                ₹{item.serviceId.serviceVariants[0].price}
              </p>
              <div className="quantity-control">
                <button
                  className="quantity-button"
                  onClick={() =>
                    updateQuantity(item._id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() =>
                    updateQuantity(item._id, Math.min(4, item.quantity + 1))
                  }
                >
                  +
                </button>
              </div>
              <button
                className="delete-button"
                onClick={() => removeFromCart(item._id)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        )),
      )}
      <div className="cart-total">
        <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
      </div>
      <button className="go-to-address-btn" onClick={() => onNext("address")}>
        Go to Address
      </button>
    </div>
  );
};

export default CartItems;
