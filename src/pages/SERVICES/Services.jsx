import React from 'react'
import './Services.css'
import ServicesScroll from './ServicesScroll'
import { CategoryContext } from '../../context/CategoryContext'
import { useState,useContext,useEffect } from 'react'


const Services = () => {
  const {subCategoryData} = useContext(CategoryContext)
  const [data, setData] = useState([]);

  useEffect(() => {
    if (subCategoryData) {
      setData(subCategoryData);
    }
  }, [subCategoryData]);

  if (!subCategoryData) {
    return <div>Loading...</div>;
  }


  return (
    <>
        <div className='services'>
               <ServicesScroll/>
               <div className='services-cart-display'>
                   <div className='service-display'>
                        {
                          data.map((subcategory)=>{
                            <div>
                               <p>{subcategory.name}</p>
                            </div>
                          })
                        }
                   </div>
                   <div className='cart-display'>
                           
                   </div>
               </div>
        </div>
    </>
  )
}

export default Services