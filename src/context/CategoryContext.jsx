import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // fetch sub categories

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`,
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          setSubCategoryData(result);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // checking subcategory id

  useEffect(()=>{
    if(selectedSubCategoryId){
      console.log(selectedSubCategoryId, 'selected sub category id in main')
    }
  },[selectedSubCategoryId])

  // Fetch services
  useEffect(()=>{
    if(selectedSubCategoryId){
      const fetchservice=async()=>{
        try{
           const responce  = await fetch(`https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`,)

           if(!responce.ok){
            throw new Error('failed to fetch services')
           }
           const data = responce.json()
           setServicesData(data)
           console.log(servicesData,'service data in main context')
        }
        catch(err){
          console.log(err)
        }
      }
      fetchservice()
    }
  },[selectedSubCategoryId])
 

  return (
    <CategoryContext.Provider
      value={{
        categoryData,
        selectedCategoryId,
        setSelectedCategoryId,
        subCategoryData,
        selectedSubCategoryId,
        setSelectedSubCategoryId,
        servicesData,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
