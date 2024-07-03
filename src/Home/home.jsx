import React from 'react'
import Maincategory from './maincategory'
import './home.css'
import Howitworks from './howitworks'
import Mostbookedservices from './MOST-BOOKED-SERVICES/mostbookedservices'
import Ourcoreservices from './OUR-CORE-SERVICES/our-core-services'


const Home = () => {
  return (
     <> 
      <div className='home-main'>
        <Maincategory/> 
        <Mostbookedservices/>
         <Howitworks/>
         <Ourcoreservices/>

      </div>
     </>
  )
}

export default Home