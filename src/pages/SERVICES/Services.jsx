import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";

const Services = () => {
  const { categoryData, selectedCategoryId, subCategoryData, setSelectedSubCategoryId,servicesData, error } = useContext(CategoryContext);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [serviceData,setServiceData]=useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubCategoryId = (id) => {
    setSelectedSubCategoryId(id);
    console.log(id, 'subcategory id in subcategory');
  };

  useEffect(() => {
    if (categoryData) {
      setLoading(true);
      const selectedCategory = categoryData.find(
        (category) => category._id === selectedCategoryId
      );
      if (selectedCategory && selectedCategory.subcategories) {
        setData(selectedCategory.subcategories);
      } else {
        setData([]); // Clear data if no subcategories are found
      }
      setLoading(false);
    }
  }, [categoryData, selectedCategoryId]);

  // sub categorys destructuring
  useEffect(() => {
    if (subCategoryData) {
      setSubData(subCategoryData);
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (servicesData) {
      setServiceData(servicesData)
      console.log(servicesData,'service data in sub page ')
    }
  }, [servicesData]);

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
        <div className="sub-category-display">
          {subData.length > 0 ? (
            subData.map((subCat) => (
              <div key={subCat._id} className="sub-category-item"  onClick={()=>handleSubCategoryId(subCat._id)}>
                <p>{subCat.name}</p>
              </div>
            ))
          ) : (
            <p>No additional subcategories available.</p>
          )}
        </div>


        {/* service display */}
        <div className="sub-category-display">
          {serviceData.length > 0 ? (
            serviceData.map((services) => (
              <div key={services._id} className="sub-category-item" >
                <p>{services.name}</p>
              </div>
            ))
          ) : (
            <p>No additional services available.</p>
          )}
        </div>
    
        <div className="cart-display">{/* Cart display content */}</div>
      </div>
    </div>
  );
};

export default Services;
