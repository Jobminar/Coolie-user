// src/pages/Home/home.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../context/CategoryContext";
import Maincategory from "../Home/maincategory";
import "./home.css";
import Howitworks from "../Home/howitworks";
import Mostbookedservices from "./MOST-BOOKED-SERVICES/mostbookedservices";
import Ourcoreservices from "./OUR-CORE-SERVICES/our-core-services";

const Home = () => {
  const navigate = useNavigate();
  const { setCategoryId } = useContext(CategoryContext);

  const handleCategoryClick = (categoryId) => {
    setCategoryId(categoryId);
    navigate("/category");
  };

  return (
    <div className="home-main">
      <Maincategory onCategoryClick={handleCategoryClick} />
      <Mostbookedservices />
      <Howitworks />
      <Ourcoreservices />
    </div>
  );
};

export default Home;
