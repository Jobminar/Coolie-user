import React, { useState } from "react";
import "./Checkout.css";

const Checkout = ({ onFinalize }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCouponApply = () => {
    console.log("Coupon Applied:", couponCode);
    // Here you could handle coupon validation or adjustments to final price
  };

  const handleConfirmPayment = () => {
    console.log("Payment Method:", paymentMethod);
    onFinalize(); // This would trigger any finalization steps, such as closing the modal or navigating away
  };

  return (
    <div className="checkout-container" style={{ backgroundColor: "#e6f7d4" }}>
      {" "}
      {/* Green background */}
      <h3>Payment Method</h3>
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={handlePaymentMethodChange}
          />
          Credit Card / Debit Card / ATM Card
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="netBanking"
            checked={paymentMethod === "netBanking"}
            onChange={handlePaymentMethodChange}
          />
          Net Banking
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={handlePaymentMethodChange}
          />
          UPI Payment
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="wallets"
            checked={paymentMethod === "wallets"}
            onChange={handlePaymentMethodChange}
          />
          Wallets
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={handlePaymentMethodChange}
          />
          Cash on Delivery
        </label>
      </div>
      <div className="coupon-section">
        <h4>Use a Coupon Code while payment</h4>
        <div className="coupon-code">
          <input
            type="text"
            placeholder="USE CODE 1234567"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className="apply-coupon-btn" onClick={handleCouponApply}>
            APPLY
          </button>
        </div>
      </div>
      <button className="confirm-payment-btn" onClick={handleConfirmPayment}>
        CONFIRM PAYMENT
      </button>
    </div>
  );
};

export default Checkout;
