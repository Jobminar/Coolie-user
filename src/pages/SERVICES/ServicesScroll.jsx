import React, { useEffect, useState, useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import "./Services.css";

const ServicesScroll = () => {
  const { categoryData, setSelectedCategoryId, error } =
    useContext(CategoryContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);

  useEffect(() => {
    console.log("Data updated in ServicesScroll:", data);
  }, [data]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  const handleSendId = (id) => {
    setSelectedCategoryId(id);
  };

  return (
    <div className="services-scroll">
      {data &&
        data.map((service) => (
          <div
            key={service._id}
            className="services-scroll-sub"
            onClick={() => handleSendId(service._id)}
          >
            <div className="service-scroll-img">
              <img
                src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${service.imageKey}`}
                alt={service.name}
              />
            </div>
            <p>{service.name}</p>
          </div>
        ))}
    </div>
  );
};

export default ServicesScroll;