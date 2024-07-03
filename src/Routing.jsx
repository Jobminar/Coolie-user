import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './Home/home'
import Header from './Header/header';

const Routing = () => {
  return (
   <>
       <BrowserRouter>
       <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>      
          </Routes>
         
       </BrowserRouter>
   </>
  )
}

export default Routing