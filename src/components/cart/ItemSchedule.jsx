// src/components/ItemSchedule.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { FaTrashAlt, FaClock } from "react-icons/fa";
import CartFooter from "./CartFooter";
import Schedule from "./Schedule"; // Import the Schedule component
import "./ItemSchedule.css"; // Ensure you have appropriate CSS styles

const ItemSchedule = ({ onNext }) => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="item-schedule">
      <div className="cart-items-container">
        {cartItems.map((cart) =>
          Array.isArray(cart.items)
            ? cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-details">
                    <h4 id="service-name">{item.serviceId.name}</h4>
                    <span className="duration-items">
                      <FaClock id="timer" />
                      <h4>
                        {item.serviceId.serviceVariants[0].serviceTime} min
                      </h4>
                      <h4> {item.quantity} Item</h4>
                    </span>
                  </div>
                  <div className="item-actions">
                    <div className="item-action-top">
                      <p className="item-price">
                        ₹{item.serviceId.serviceVariants[0].price}
                      </p>
                      <button
                        className="delete-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                    <div className="quantity">
                      <button
                        id="quantitybtn"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        -
                      </button>
                      <span id="quantity-text">{item.quantity}</span>
                      <button
                        id="quantitybtn"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.min(4, item.quantity + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Add schedule selector for each item here */}
                  <div className="item-schedule-selector">
                    <ScheduleSelector item={item} />
                  </div>
                </div>
              ))
            : null,
        )}
      </div>
      <CartFooter onNext={onNext} />
    </div>
  );
};

const ScheduleSelector = ({ item }) => {
  const [selectedDateTime, setSelectedDateTime] = useState({
    selectedDate: "",
    selectedTime: "9AM - 10AM",
    selectedMonth: new Date().getMonth(),
  });

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  return (
    <div className="schedule-selector">
      <h5>Schedule {item.serviceId.name}</h5>
      <Schedule onDateTimeSelect={handleDateTimeSelect} />
      <p>
        Selected: {selectedDateTime.selectedDate}{" "}
        {selectedDateTime.selectedTime}
      </p>
    </div>
  );
};

export default ItemSchedule;
