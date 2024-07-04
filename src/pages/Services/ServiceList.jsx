// src/components/ServiceList.js
import React, { useEffect, useState } from "react";
import ServiceCategory from "./ServiceCategory";

const ServiceList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="service-list">
      {categories.map((category) => (
        <ServiceCategory key={category.id} category={category} />
      ))}
    </div>
  );
};

export default ServiceList;
