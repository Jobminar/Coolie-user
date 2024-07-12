import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from "../../assets/images/dropdown.png";
import CartSummary from "../../components/cart/CartSummary";
import { CartContext } from "../../context/CartContext";

const Services = ({ userId }) => {
  const {
    categoryData,
    selectedCategoryId,
    subCategoryData,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    servicesData,
    error,
  } = useContext(CategoryContext);
  // const {handleCart}=useContext(CartContext)
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [items, setItems] = useState([
    {
      userId: "",
      serviceId: "",
      categoryId: "",
      subCategoryId: "",
    },
  ]);

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

  useEffect(() => {
    if (subCategoryData) {
      setSubData(subCategoryData);
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (servicesData) {
      setServiceData(servicesData);
      console.log(servicesData, "service data in sub page");
    }
  }, [servicesData, activeSubCategory]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (loading || !categoryData) {
    return <div className="loading">Loading...</div>;
  }

  const toggleDescription = (serviceId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  // handle cart
  const handleCart = async (serviceId, categoryId, subCategoryId) => {
    console.log(
      serviceId,
      categoryId,
      selectedCategoryId,
      "ids from services.jsx to send cartdata",
    );
    const newItem = {
      userId: "668bc5a39ea9a691fe736632",
      items: [
        {
          serviceId,
          categoryId,
          subCategoryId,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/cart/create-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        },
      );

      if (response.ok) {
        alert("items added to cart");
        const responseData = await response.json();
        setItems((prevItems) => [...prevItems, newItem.items[0]]);
        console.log("Item added to cart:", responseData);
      } else {
        console.error("Failed to add item to cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  console.log(items, "items");

  return (
    <div className="services">
      <ScrollableTabs />

      <div className="services-cart-display">
        <div className="subcat-services-dispaly">
          <div className="sub-category-display">
            {subData.length > 0 ? (
              subData.map((subCat) => (
                <div
                  key={subCat._id}
                  className={`sub-category-item ${
                    selectedSubCategoryId === subCat._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSubCategoryId(subCat._id)}
                >
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
            {serviceData.map((service) => (
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
                    {service.serviceVariants.map((variant) => (
                      <div key={variant._id} className="service-variant">
                        <p>
                          ({variant.min} to {variant.max} {variant.metric})
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="dropdown"
                    onClick={() => toggleDescription(service._id)}
                  >
                    <img src={dropdown} alt="dropdown" />
                  </div>
                </div>
                <div
                  className="description"
                  style={{
                    display: descriptionVisibility[service._id]
                      ? "block"
                      : "none",
                  }}
                >
                  {service.description}
                </div>
                <div className="price">
                  <p></p>
                  {service.serviceVariants.map((variant) => (
                    <div key={variant._id}>
                      <p>&#8377; {variant.price}</p>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      handleCart(
                        service._id,
                        service.categoryId._id,
                        service.subCategoryId._id,
                      )
                    }
                  >
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-display">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Services;
