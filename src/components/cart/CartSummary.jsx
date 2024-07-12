import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import CartItems from "./CartItems";
import Address from "./Address";
import Schedule from "./Schedule";
import Checkout from "./Checkout";
import "./CartSummary.css";
import cartIcon from "../../assets/images/cart.svg";
import cartIconActive from "../../assets/images/cart-active.png";
import locationMarker from "../../assets/images/marker.svg";
import locationMarkerActive from "../../assets/images/location-marker-active.png";
import calendarIcon from "../../assets/images/calender.svg";
import calendarIconActive from "../../assets/images/calender-active.png";
import checkoutIcon from "../../assets/images/checkout.svg";
import checkoutIconActive from "../../assets/images/checkout-active.png";
import arrowIcon from "../../assets/images/Arrows.png";

const CartSummary = () => {
  const { cartItems } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState("cart");

  // Function to change tabs, called by child components
  const handleNextStep = (nextTab) => {
    setActiveTab(nextTab);
  };

  return (
    <div className="cart-summary">
      <div className="cart-steps-container">
        <div className="cart-steps">
          <div
            className={`step ${activeTab === "cart" ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={activeTab === "cart" ? cartIconActive : cartIcon}
              alt="Cart"
            />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="badge">{cartItems.length}</span>
            )}
          </div>
          <img src={arrowIcon} alt="Arrow" className="arrow-icon" />
          <div
            className={`step ${activeTab === "address" ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={
                activeTab === "address" ? locationMarkerActive : locationMarker
              }
              alt="Address"
            />
            <span>Address</span>
          </div>
          <img src={arrowIcon} alt="Arrow" className="arrow-icon" />
          <div
            className={`step ${activeTab === "schedule" ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={activeTab === "schedule" ? calendarIconActive : calendarIcon}
              alt="Schedule"
            />
            <span>Schedule</span>
          </div>
          <img src={arrowIcon} alt="Arrow" className="arrow-icon" />
          <div
            className={`step ${activeTab === "checkout" ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={activeTab === "checkout" ? checkoutIconActive : checkoutIcon}
              alt="Checkout"
            />
            <span>Checkout</span>
          </div>
        </div>
      </div>
      {activeTab === "cart" && (
        <CartItems onNext={() => handleNextStep("address")} />
      )}
      {activeTab === "address" && (
        <Address onNext={() => handleNextStep("schedule")} />
      )}
      {activeTab === "schedule" && (
        <Schedule onNext={() => handleNextStep("checkout")} />
      )}
      {activeTab === "checkout" && (
        <Checkout onFinalize={() => handleNextStep("cart")} />
      )}
    </div>
  );
};

export default CartSummary;
