import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import CartItems from "./CartItems";
import Address from "./Address";
import Schedule from "./Schedule";
import Checkout from "./Checkout";
import "./CartSummary.css";
import cartIcon from "../../assets/images/cart.svg";
import cartIconActive from "../../assets/images/cart-active.svg";
import locationMarker from "../../assets/images/marker.svg";
import locationMarkerActive from "../../assets/images/location-marker-active.svg";
import calendarIcon from "../../assets/images/calender.svg";
import calendarIconActive from "../../assets/images/calender-active.svg";
import checkoutIcon from "../../assets/images/checkout.svg";
import checkoutIconActive from "../../assets/images/checkout-active.png";
import arrowIcon from "../../assets/images/Arrows.svg";
import arrowIconActive from "../../assets/images/Arrows-active.svg";

const CartSummary = () => {
  const { cartItems } = useContext(CartContext);
  const [activeTabs, setActiveTabs] = useState([]);

  // Function to change tabs, called by child components
  const handleNextStep = (nextTab) => {
    setActiveTabs((prevActiveTabs) =>
      prevActiveTabs.includes(nextTab)
        ? prevActiveTabs
        : [...prevActiveTabs, nextTab],
    );
  };

  return (
    <div className="cart-summary">
      <div className="cart-steps-container">
        <div className="cart-steps">
          <div
            className={`step ${activeTabs.includes("cart") ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={activeTabs.includes("cart") ? cartIconActive : cartIcon}
              alt="Cart"
            />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="badge">{cartItems.length}</span>
            )}
          </div>
          <img
            src={
              activeTabs.includes("cart") && activeTabs.includes("address")
                ? arrowIconActive
                : arrowIcon
            }
            alt="Arrow"
            className="arrow-icon"
          />
          <div
            className={`step ${activeTabs.includes("address") ? "active" : ""}`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={
                activeTabs.includes("address")
                  ? locationMarkerActive
                  : locationMarker
              }
              alt="Address"
            />
            <span>Address</span>
          </div>
          <img
            src={
              activeTabs.includes("address") && activeTabs.includes("schedule")
                ? arrowIconActive
                : arrowIcon
            }
            alt="Arrow"
            className="arrow-icon"
          />
          <div
            className={`step ${
              activeTabs.includes("schedule") ? "active" : ""
            }`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={
                activeTabs.includes("schedule")
                  ? calendarIconActive
                  : calendarIcon
              }
              alt="Schedule"
            />
            <span>Schedule</span>
          </div>
          <img
            src={
              activeTabs.includes("schedule") && activeTabs.includes("checkout")
                ? arrowIconActive
                : arrowIcon
            }
            alt="Arrow"
            className="arrow-icon"
          />
          <div
            className={`step ${
              activeTabs.includes("checkout") ? "active" : ""
            }`}
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src={
                activeTabs.includes("checkout")
                  ? checkoutIconActive
                  : checkoutIcon
              }
              alt="Checkout"
            />
            <span>Checkout</span>
          </div>
        </div>
      </div>
      {!activeTabs.length && (
        <CartItems onNext={() => handleNextStep("cart")} />
      )}
      {activeTabs.includes("cart") && !activeTabs.includes("address") && (
        <Address onNext={() => handleNextStep("address")} />
      )}
      {activeTabs.includes("address") && !activeTabs.includes("schedule") && (
        <Schedule onNext={() => handleNextStep("schedule")} />
      )}
      {activeTabs.includes("schedule") && !activeTabs.includes("checkout") && (
        <Checkout onFinalize={() => handleNextStep("checkout")} />
      )}
    </div>
  );
};

export default CartSummary;
