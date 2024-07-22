import React, { useState, useEffect } from "react";
import "./WorkerComponent.css";

const WorkerComponent = ({ worker }) => {
  const [timeLeft, setTimeLeft] = useState(215); // 3:35 in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="worker-component">
      <div className="time-left">
        Your worker is coming in {formatTime(timeLeft)}
      </div>
      <div className="worker-details">
        <img src={worker.image} alt={worker.name} className="worker-image" />
        <div>
          <div className="worker-name">{worker.name}</div>
          <div className="worker-distance">{worker.distance} (5 mins away)</div>
          <div className="worker-rating">
            ⭐ {worker.rating} ({worker.reviews} reviews)
          </div>
        </div>
      </div>
      <div className="otp-section">
        <div>Before Provider start the work</div>
        <div className="otp-label">Your OTP Pin</div>
        <div className="otp-inputs">
          <input type="text" maxLength="1" value="5" readOnly />
          <input type="text" maxLength="1" value="5" readOnly />
          <input type="text" maxLength="1" value="9" readOnly />
          <input type="text" maxLength="1" value="9" readOnly />
        </div>
      </div>
      <div className="actions">
        <button className="call-button">📞</button>
        <button className="message-button">💬</button>
        <button className="cancel-button">Cancel Booking</button>
      </div>
    </div>
  );
};

export default WorkerComponent;
