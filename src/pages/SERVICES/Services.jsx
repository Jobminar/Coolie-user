import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from '../../assets/images/dropdown.png';

const Services = () => {
  const { categoryData, selectedCategoryId, subCategoryData, selectedSubCategoryId, setSelectedSubCategoryId, servicesData, error } = useContext(CategoryContext);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [descriptionVisibility, setDescriptionVisibility] = useState({});

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

  useEffect(() => {
    if (subCategoryData) {
      setSubData(subCategoryData);
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (servicesData) {
      setServiceData(servicesData);
      console.log(servicesData, 'service data in sub page');
    }
  }, [servicesData]);

  useEffect(() => {
    const findActive = () => {
      if (subCategoryData && selectedSubCategoryId) {
        const activeSubCat = subCategoryData.find(subCat => subCat._id === selectedSubCategoryId);
        if (activeSubCat) {
          setActiveSubCategory(activeSubCat);
        } else {
          setActiveSubCategory(subCategoryData[0]); // Clear if no matching subcategory is found
        }
      }
    };
    findActive();
  }, [subCategoryData, selectedSubCategoryId]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (loading || !categoryData) {
    return <div className="loading">Loading...</div>;
  }

  const toggleDescription = (serviceId) => {
    setDescriptionVisibility(prevState => ({
      ...prevState,
      [serviceId]: !prevState[serviceId]
    }));
  };

  return (
    <div className="services">
      <ScrollableTabs />
      <div className="services-cart-display">
        <div className="services-main-dispaly">
          <div className="sub-category-display">
            <div className="active">
              <p>{activeSubCategory ? ` ${activeSubCategory.name}` : 'No active subcategory'}</p>
            </div>
            {subData.length > 0 ? (
              subData.map((subCat) => (
                <div key={subCat._id} className="sub-category-item" onClick={() => setSelectedSubCategoryId(subCat._id)}>
                  <div className="subcat-icon-container">
                    <img
                      src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${subCat.imageKey}`}
                      alt={subCat.name}
                      className="tab-image"
                    />
                  </div>
                  <p>{subCat.name}</p>
                </div>
              ))
            ) : (
              <p>No additional subcategories available.</p>
            )}
          </div>

          {/* Service display */}
          <div className="services-display">
            <p></p>
            {serviceData.map(service => (
              <div key={service._id} className="sub-category-service-item">
                <div className="service-main-head">
                  <div className="service-icon-container">
                    <img
                      src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${service.subCategoryId.imageKey}`}
                      alt={service.subCategoryId.name}
                      className="tab-image"
                    />
                  </div>
                  <div className="service-content">  
                    <h3>{service.name}</h3>
                    {service.serviceVariants.map(variant => (
                      <div key={variant._id} className="service-variant">
                        <p>({variant.min} to {variant.max} {variant.metric})</p>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown" onClick={() => toggleDescription(service._id)}>
                    <img src={dropdown} alt="dropdown"/>
                  </div>
                </div>
                <div className="description" style={{ display: descriptionVisibility[service._id] ? 'block' : 'none' }}>
                  {service.description}
                </div>
                <div className="price">
                  <p></p>
                  
                  {service.serviceVariants.map(variant => (
                    <div key={variant._id}>
                      <p>&#8377; {variant.price}</p>
                    </div>
                  ))}
                  <button>ADD</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-display">{/* Cart display content */}</div>
      </div>
    </div>
  );
};

export default Services;
