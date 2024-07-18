import React from "react";
import "./header.css"
import playstore from "../../assets/images/play-store.svg";
import apple from "../../assets/images/apple.svg";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import cart from "../../assets/images/cart.png";
import logo from '../../assets/images/coolie-logo.png'
import registerpro from '../../assets/images/registerprofessional.png'
import callus from '../../assets/images/callus.png'
import location from '../../assets/images/location-marker.png'
import help from '../../assets/images/help.png'
import translate from '../../assets/images/translate.png'
import profile from '../../assets/images/profile.png'

const Header = () => {
  const locationname = 'Hyderabad'
  return (
    <>
         <div className="main-h">
              <div className="f-h">
                  <div className="f-h-icons">
                      <img src={apple} alt="apple-icon"/>
                      <img src={playstore} alt="play-store-icon"/>
                      <p>Download Mobile App</p>
                  </div>
               
                  <div className="f-h-last-icons">
                    <img src={help} alt="icon"/>
                    <img src={translate} alt="icon"/>
                    <img src={profile} alt="icon"/>
                  </div>
              </div>
              <div className='s-h'>
                   <div className="s-h-logo">
                      <img src={logo} alt="logo"/>
                   </div>
                   {/* <div className="s-h-content">
                        <div className="s-h-bottom"> 
                        </div>
                   </div> */}
                   <div className="s-h-s">
                         <div className="location">
                               <img src={location} alt="location"/>
                               <input placeholder="Hyderabad"/>
                         </div>
                         <div className="search-header">
                             <input placeholder="search for a service ex: Room cleaning , kitchen cleaning "/>
                         </div>
                         <button className="books-button">Book a Service</button>
                   </div>
              </div>
         </div>
    </>
  );
};

export default Header;
