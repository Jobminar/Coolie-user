import React, { useContext } from "react";
import "./ScheduleFooter.css"; // Use a different CSS file for ScheduleFooter
import { CartContext } from "../../context/CartContext";

const ScheduleFooter = ({ onNext }) => {
  const { totalItems, totalPrice } = useContext(CartContext);

  return (
    <div className="schedule-total">
      <div className="schedule-total-info">
        <h5>{totalItems} Items</h5>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="schedule-total-button">
        <button
          className="proceed-to-checkout-btn"
          onClick={() => onNext("checkout")}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default ScheduleFooter;
