// src/components/ServiceItem.js
import React from "react";

const ServiceItem = ({ service }) => {
  return (
    <div className="service-item">
      <img src={service.image} alt={service.name} />
      <div>
        <h4>{service.name}</h4>
        <p>{service.description}</p>
        <p>{`₹${service.price}`}</p>
        <button>Add</button>
      </div>
    </div>
  );
};

export default ServiceItem;
