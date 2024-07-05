// src/components/ServicePage.js
import React, { useEffect, useState, useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import Subcategory from "./Subcategory";
import "./styles/ServicePage.css";

const ServicePage = () => {
  const { categoryId } = useContext(CategoryContext);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        console.log(`Fetching subcategories for category ID: ${categoryId}`);
        const response = await fetch(
          `https://api.coolieno1.in/v1.0/core/sub-categories/category/${categoryId}`,
        );
        if (!response.ok) {
          console.error("Fetch error: ", response.status, response.statusText);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result); // Log the API data
        setSubcategories(result);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  if (!categoryId) {
    return <div>Error: Category ID not found</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ServicePage">
      <h1>Service Categories</h1>
      <div className="subcategories-list">
        {subcategories.map((subcategory) => (
          <Subcategory key={subcategory._id} subcategory={subcategory} />
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
