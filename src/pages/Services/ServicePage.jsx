// src/ServicePage.js
import React from "react";
import ServiceList from "./components/ServiceList";
import "./ServicePage.css";

const ServicePage = () => {
  return (
    <div className="ServicePage">
      <h1>Service Categories</h1>
      <ServiceList />
    </div>
  );
};

export default ServicePage;
