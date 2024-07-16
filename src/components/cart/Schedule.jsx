// src/components/Schedule.jsx
import React, { useState } from "react";
import Calendar from "./Calendar"; // Import the Calendar component
import "./Schedule.css";

const Schedule = ({ onDateTimeSelect }) => {
  const [selectedDateTime, setSelectedDateTime] = useState({
    selectedDate: "",
    selectedTime: "9AM - 10AM",
    selectedMonth: new Date().getMonth(),
  });

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
    if (onDateTimeSelect) {
      onDateTimeSelect(dateTime);
    }
  };

  return (
    <div className="schedule-container">
      <Calendar onDateTimeSelect={handleDateTimeSelect} />
      <p>
        You have selected {selectedDateTime.selectedDate}{" "}
        {selectedDateTime.selectedTime}
      </p>
    </div>
  );
};

export default Schedule;
