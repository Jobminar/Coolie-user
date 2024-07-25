// FlashScreen.jsx
import React, { useEffect } from "react";
import "./FlashScreen.css";

const FlashScreen = ({ onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000); // Flash screen will be visible for 3 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="flash-screen">
      <h1>Welcome to Our Chatbot</h1>
    </div>
  );
};

export default FlashScreen;
