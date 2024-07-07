import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home/home";
import Header from "./components/Header/header";
import Services from "./pages/SERVICES/Services";

const Routing = () => {
  return (
    <CartProvider>
      <CategoryProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </Router>
      </CategoryProvider>
    </CartProvider>
  );
};

export default Routing;
