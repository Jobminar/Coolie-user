// src/context/CategoryContext.js
import React, { createContext, useState } from "react";
//iam passing category id
export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryId, setCategoryId] = useState(null);

  return (
    <CategoryContext.Provider value={{ categoryId, setCategoryId }}>
      {children}
    </CategoryContext.Provider>
  );
};
