import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import CartSummary from "../../components/cart/CartSummary";

const Services = () => {
  const { categoryData, selectedCategoryId, error } =
    useContext(CategoryContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryData) {
      setLoading(true);
      const selectedCategory = categoryData.find(
        (category) => category._id === selectedCategoryId,
      );
      if (selectedCategory && selectedCategory.subcategories) {
        setData(selectedCategory.subcategories);
      } else {
        setData([]); // Clear data if no subcategories are found
      }
      setLoading(false);
    }
  }, [categoryData, selectedCategoryId]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (loading || !categoryData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="services">
      <ScrollableTabs />
      <div className="services-cart-display">
        <div className="service-display">
          {data.length > 0 ? (
            data.map((subcategory) => (
              <div key={subcategory._id} className="subcategory-item">
                <p>{subcategory.name}</p>
              </div>
            ))
          ) : (
            <p>No subcategories available.</p>
          )}
        </div>
        <div className="cart-display">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Services;
