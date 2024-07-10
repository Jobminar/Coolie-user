import React, { useState, useEffect } from "react";
import "./Schedule.css";

const Schedule = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("9AM - 10AM");
  const [dates, setDates] = useState([]);
  const [days, setDays] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  //this is slected date
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    updateDates(currentOffset, selectedMonth);
  }, [currentOffset, selectedMonth]);

  const updateDates = (offset, month) => {
    const currentDate = new Date();
    currentDate.setMonth(month);
    currentDate.setDate(currentDate.getDate() + offset); // Start from the current date + offset
    const newDates = [];
    const newDays = [];
    for (let i = 0; i < 4; i++) {
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + i);
      newDates.push(futureDate.getDate().toString().padStart(2, "0"));
      newDays.push(
        futureDate
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
      );
    }
    setDates(newDates);
    setDays(newDays);
    setSelectedDate(newDates[0]);
  };

  const handlePrevious = () => {
    if (currentOffset > 0) {
      setCurrentOffset(currentOffset - 4); // Move backward by 4 days
    }
  };

  const handleNext = () => {
    setCurrentOffset(currentOffset + 4); // Move forward by 4 days
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
    setCurrentOffset(0); // Reset offset when month changes
  };

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
      <h3>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>{" "}
        {new Date().getFullYear()}
      </h3>
      <p>
        You have selected {months[selectedMonth]} {selectedDate},{" "}
        {days[dates.indexOf(selectedDate)]} {selectedTime},{" "}
        {new Date().getFullYear()}
      </p>
      <div className="date-selector">
        <button
          className="arrow-btn"
          onClick={handlePrevious}
          disabled={currentOffset === 0}
        >
          &lt;
        </button>
        <div className="dates">
          {dates.map((date, index) => (
            <div
              key={date}
              className={`date ${selectedDate === date ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="day">{days[index]}</div>
              {date}
            </div>
          ))}
        </div>
        <button className="arrow-btn" onClick={handleNext}>
          &gt;
        </button>
      </div>
      <div className="time-selector">
        {times.map((time) => (
          <label
            key={time}
            className={`time ${selectedTime === time ? "active" : ""}`}
          >
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
        Confirm Payment
      </button>
    </div>
  );
};

export default Schedule;
