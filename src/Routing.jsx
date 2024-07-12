import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home/home";
import Header from "./components/Header/header";
import Services from "./pages/SERVICES/Services";
import { AuthProvider } from "./context/AuthContext";
import LoginComponent from "./components/LoginComponent";
import ProtectedRoute from "./ProtectedRoute";

const Routing = () => {
  return (
    <AuthProvider>
    <CartProvider>
      <CategoryProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/" element={<ProtectedRoute />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </Router>
      </CategoryProvider>
    </CartProvider>
    </AuthProvider>
  );
};

export default Routing;
