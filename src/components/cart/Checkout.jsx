import React, { useState } from "react";
import "./Checkout.css";
//Added razorpay
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

  const handleRazorpayPayment = async () => {
    const options = {
      key: "rzp_test_b8XfUOQ4u8dlSq", // Replace with your Razorpay API key
      amount: 50000, // Amount in paise (50000 paise = 500 INR)
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      image: "https://your-logo-url.com", // Replace with your logo URL
      handler: function (response) {
        console.log("Payment successful", response);
        onFinalize(); // Trigger finalization steps
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleConfirmPayment = () => {
    console.log("Payment Method:", paymentMethod);
    if (
      paymentMethod === "card" ||
      paymentMethod === "netBanking" ||
      paymentMethod === "upi" ||
      paymentMethod === "wallets"
    ) {
      handleRazorpayPayment();
    } else {
      onFinalize(); // Trigger finalization steps for Cash on Delivery
    }
  };

  return (
    <div className="checkout-container" style={{ backgroundColor: "#e6f7d4" }}>
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
