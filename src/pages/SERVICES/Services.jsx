import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ServicesScroll from "./ServicesScroll";
import { CategoryContext } from "../../context/CategoryContext";

const Services = () => {
  const { categoryData, selectedCategoryId, error } = useContext(CategoryContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryData && selectedCategoryId) {
      const selectedCategory = categoryData.find(
        (category) => category._id === selectedCategoryId,
      );
      if (selectedCategory && selectedCategory.subcategories) {
        setData(selectedCategory.subcategories);
      }
    }
  }, [categoryData, selectedCategoryId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="services">
      <ServicesScroll />
      <div className="services-cart-display">
        <div className="service-display">
          {data.length > 0 ? (
            data.map((subcategory) => (
              <div key={subcategory._id}>
                <p>{subcategory.name}</p>
              </div>
            ))
          ) : (
            <p>No subcategories available.</p>
          )}
        </div>
        <div className="cart-display">{/* Cart display content */}</div>
      </div>
    </div>
  );
};

export default Services;
