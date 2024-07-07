import React, { useState } from "react";
import "./Schedule.css";

const Schedule = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState("03");
  const [selectedTime, setSelectedTime] = useState("9AM - 10AM");

  // Example times for the full day
  const times = [
    "9AM - 10AM",
    "10AM - 11AM",
    "11AM - 12PM",
    "12PM - 1PM",
    "1PM - 2PM",
    "2PM - 3PM",
    "3PM - 4PM",
    "4PM - 5PM",
  ];

  return (
    <div className="schedule-container">
      <h3>March 2024</h3>
      <p>
        You have selected {selectedDate}rd, Wednesday {selectedTime}, 2024
      </p>
      <div className="date-selector">
        <button className="arrow-btn">&lt;</button>
        <div className="dates">
          {["01", "02", "03", "04"].map((date) => (
            <div
              key={date}
              className={`date ${selectedDate === date ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </div>
          ))}
        </div>
        <button className="arrow-btn">&gt;</button>
      </div>
      <div className="time-selector">
        {times.map((time) => (
          <label key={time} className="time">
            <input
              type="radio"
              name="time"
              value={time}
              checked={selectedTime === time}
              onChange={() => setSelectedTime(time)}
            />
            {time}
          </label>
        ))}
      </div>
      <button
        className="confirm-payment-btn"
        onClick={() => onNext("checkout")}
      >
        Confirm Schedule
      </button>
    </div>
  );
};

export default Schedule;
