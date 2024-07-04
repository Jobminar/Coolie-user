// src/components/ServiceCategory.js
import React from "react";
import ServiceItem from "./ServiceItem";

const ServiceCategory = ({ category }) => {
  return (
    <div className="service-category">
      <h3>{category.name}</h3>
      <div className="service-items">
        {category.services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceCategory;
