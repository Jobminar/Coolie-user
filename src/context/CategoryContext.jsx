import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setError] = useState(null);

  console.log('Selected Category ID:', selectedCategoryId);

  // Fetch category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.coolieno1.in/v1.0/core/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCategoryData(result);
        console.log('Category Data:', result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <CategoryContext.Provider value={{ categoryData, setSelectedCategoryId, error }}>
      {children}
    </CategoryContext.Provider>
  );
};