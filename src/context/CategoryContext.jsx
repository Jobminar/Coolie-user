import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData,setSubCategoryData]=useState(null)
  const [error, setError] = useState(null);
  console.log(setCategoryData,'subcategorydata')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCategoryData(result);
        console.log("Category Data:", result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);


  useEffect(()=>{
        const fetchData = async()=>{
          try{
            const responce =await fetch('https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}')
            if(!responce.ok){
              throw new Error('Error occured while fetch the data')
            }
            const data = responce.json()
              setSubCategoryData(data)
              
          }
          catch(err){
            console.log(err,'error')
          }
        }
        fetchData()
  },[])

  return (
    <CategoryContext.Provider
      value={{ categoryData, selectedCategoryId, subCategoryData, setSelectedCategoryId, error }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
