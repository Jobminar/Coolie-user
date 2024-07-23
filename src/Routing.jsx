import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/home";
import Header from "./components/Header/header";
import Services from "./pages/SERVICES/Services";
import LoginComponent from "./components/LoginComponent";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Footer/footer";
import Aboutus from "./components/Aboutus/aboutus";
import Userprofile from "./pages/USER-PROFILE/user-profile";
import Addresses from "./pages/ADDRESSES/addresses";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/" element={<ProtectedRoute />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/userprofile" element={<Userprofile />}/>
        <Route path="/addresses" element={<Addresses />}/>
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
