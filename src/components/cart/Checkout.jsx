import React, { useState, useEffect, useContext } from "react";
import coolieLogo from "../../assets/images/coolie-logo.png";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import { CartContext } from "../../context/CartContext"; // Import CartContext
import "./Checkout.css";

const Checkout = ({ onFinalize }) => {
  const { user } = useAuth(); // Get user data from AuthContext
  const { totalPrice } = useContext(CartContext); // Get total price from CartContext
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (user) {
      console.log("Prefilling with user data:", user);
    }
  }, [user]);

  const handleCouponApply = () => {
    console.log("Coupon Applied:", couponCode);
    // Here you could handle coupon validation or adjustments to final price
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_b8XfUOQ4u8dlSq", // Replace with your Razorpay API key
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      name: "Coolie NO-1",
      description: "Test Transaction",
      image: coolieLogo, // Replace with your logo URL
      handler: function (response) {
        console.log("Payment successful", response);
        onFinalize(); // Trigger finalization steps
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },
      notes: {
        address: user?.address || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleConfirmPayment = () => {
    console.log("Initiating Razorpay Payment");
    handleRazorpayPayment();
  };

  return (
    <div className="checkout-container" style={{ backgroundColor: "#e6f7d4" }}>
      <h3>Payment Method</h3>
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
