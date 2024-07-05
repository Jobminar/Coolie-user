// src/Routing.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import Home from "./pages/Home/home";
import Header from "./components/Header/header";
import ServicePage from "./pages/Services/ServicePage";

const Routing = () => {
  return (
    <>
      <CategoryProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<ServicePage />} />
          </Routes>
        </Router>
      </CategoryProvider>
    </>
  );
};

export default Routing;
