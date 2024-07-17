import React, { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import Calendar from "./Calendar"; // Import the Calendar component
import ItemSchedule from "./ItemSchedule"; // Import the ItemSchedule component
import ScheduleFooter from "./ScheduleFooter";
import "./Schedule.css";

const Schedule = ({ onNext }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between Calendar and ItemSchedule

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="schedule-container">
      <button className="editing-btn" onClick={toggleEdit}>
        {isEditing ? <FaSave /> : <FaEdit />}
        <span>
          I would like to have individual & different slots for services choosen
        </span>
      </button>
      {isEditing ? <ItemSchedule /> : <Calendar />}
      <ScheduleFooter onNext={onNext} />
    </div>
  );
};

export default Schedule;
