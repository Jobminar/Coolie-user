import React, { useState } from "react";
import "./Schedule.css";

const Schedule = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("9AM - 10AM");
  const [startDay, setStartDay] = useState(0); // Index to track the start day for display

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysCount = daysInMonth(currentMonth, currentYear);

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

  const handlePrevClick = () => {
    if (startDay > 0) setStartDay(startDay - 4);
  };

  const handleNextClick = () => {
    if (startDay + 3 < daysCount) setStartDay(startDay + 3);
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        day: i,
        weekday: date.toLocaleString("default", { weekday: "short" }),
      });
    }

    return days.slice(startDay, startDay + 4).map(({ day, weekday }) => (
      <div
        key={day}
        className={`date ${selectedDate.getDate() === day ? "active" : ""}`}
        onClick={() =>
          setSelectedDate(new Date(currentYear, currentMonth, day))
        }
      >
        <div>{weekday}</div>
        <div>{day}</div>
      </div>
    ));
  };

  return (
    <div className="schedule-container">
      <h3>
        {selectedDate.toLocaleString("default", { month: "long" })}{" "}
        {currentYear}
      </h3>
      <p>
        You have selected {selectedDate.getDate()}{" "}
        {selectedDate.toLocaleString("default", { weekday: "long" })},{" "}
        {selectedTime}
      </p>
      <div className="date-selector">
        <button className="arrow-btn" onClick={handlePrevClick}>
          &lt;
        </button>
        <div className="dates">{renderCalendar()}</div>
        <button className="arrow-btn" onClick={handleNextClick}>
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
        Confirm Schedule
      </button>
    </div>
  );
};

export default Schedule;
