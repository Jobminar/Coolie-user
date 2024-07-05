import React from "react";
import AppleIcon from "@mui/icons-material/Apple";
import "./header.css";
import playstore from "../../assets/images/play-store.png";
import apple from "../../assets/images/apple.png";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import register from "../../assets/images/register.png";
import cart from "../../assets/images/cart.png";

const Header = () => {
  return (
    <>
      <div className="header-main">
        <div className="first-header">
          <div className="header-main-start">
            <img src={apple} alt="apple" />
            <img src={playstore} alt="play store" />
            <p>Download Mobile App</p>
          </div>
          <div className="header-main-end">
            <div>
              <Person2OutlinedIcon />
              Login
            </div>
            <div>
              <img src={register} alt="register" />
              Register
            </div>
            <img src={cart} alt="cart" />
          </div>
        </div>
        <div className="second-header"></div>
      </div>
    </>
  );
};

export default Header;
