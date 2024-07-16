// src/components/Calendar.jsx
import React from "react";

const Calendar = ({ onDateTimeSelect }) => {
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("9AM - 10AM");
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth(),
  );

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

  const currentDate = new Date();
  currentDate.setMonth(selectedMonth);
  currentDate.setDate(currentDate.getDate() + currentOffset);

  const dates = [];
  const days = [];
  for (let i = 0; i < 4; i++) {
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + i);
    dates.push(futureDate.getDate().toString().padStart(2, "0"));
    days.push(
      futureDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
    );
  }

  const handlePrevious = () => {
    if (currentOffset > 0) {
      setCurrentOffset(currentOffset - 4);
    }
  };

  const handleNext = () => {
    setCurrentOffset(currentOffset + 4);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
    setCurrentOffset(0); // Reset offset when month changes
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateTimeSelect) {
      onDateTimeSelect({ selectedDate: date, selectedTime, selectedMonth });
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (onDateTimeSelect) {
      onDateTimeSelect({ selectedDate, selectedTime: time, selectedMonth });
    }
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
    <div className="calendar-container">
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
              onClick={() => handleDateSelect(date)}
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
              onChange={() => handleTimeSelect(time)}
            />
            {time}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
