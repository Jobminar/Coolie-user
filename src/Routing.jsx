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
import { OrdersProvider } from "./context/OrdersContext";
import { MessagingProvider } from "./context/MessagingContext";
import Footer from "./components/Footer/footer";
import Aboutus from "./components/Aboutus/aboutus";
import WorkerComponent from "./pages/WorkerComponent";
import Userprofile from "./pages/USER-PROFILE/user-profile";
import Addresses from "./pages/USER-PROFILE/ADDRESSES/addresses";
import Bookings from "./pages/USER-PROFILE/BOOKINGS/Bookings.jsx";

const Routing = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoryProvider>
          <MessagingProvider>
            <OrdersProvider>
              {" "}
              {/* Wrap your application with MessagingProvider */}
              <Router>
                <Header />
                <Routes>
                  <Route path="/login" element={<LoginComponent />} />
                  <Route path="/" element={<ProtectedRoute />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/aboutus" element={<Aboutus />} />
                  <Route path="/workers" element={<WorkerComponent />} />
                  <Route path="/userprofile" element={<Userprofile />} />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/bookings" element={<Bookings/>} />
                </Routes>
                <Footer />
              </Router>
            </OrdersProvider>
          </MessagingProvider>
        </CategoryProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default Routing;
