import React, { useContext, useEffect, useState } from "react";
import "./maincategory.css";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../context/CategoryContext";
import coverdyou1 from '../../assets/images/coveredyou-1.jpeg'
import coverdyou2 from '../../assets/images/coveredyou-2.jpeg'
import coverdyou3 from '../../assets/images/coverdyou-3.jpeg'

const Maincategory = () => {
  const navigate = useNavigate();
  const { categoryData} = useContext(CategoryContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);


  return (
    <>
      <div className="main-category-con">
        {data &&
          data.map((item) => (
            <div
              key={item._id}
              className="sub-cat-con"
            >
              <div className="main-cat-img" onClick={() => navigate('/services')}>
                <img  
                  src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${item.imageKey}`}
                  alt={item.name}
                />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
      </div>
      <div className="coveredyou-con">
        <h1 className="covered-you-headdig">
          Coolie No 1<span> covered you</span>
        </h1>
        <div className="covered-you-main-flow">
          <div className="covered-you-sub-flow first-sub">
            <div className="covered-you-img">
             <img className="coverdyou-show-icon" src={coverdyou1} alt="coveredyou icon" />
            </div>
            <div className="coveredyou-content">
              <h1>Explore top Services</h1>
              <p>
              Explore top services" typically refers to discovering or investigating prominent. 
              </p>
            </div>
          </div>
          <div className="covered-you-sub-flow second-sub">
          <div className="covered-you-img">
             <img className="coverdyou-show-icon" src={coverdyou2} alt="coveredyou icon" />
            </div>
            <div className="coveredyou-content">
              <h1>Fast and Flexible</h1>
              <p>
              Explore top services" typically refers to discovering or investigating prominent .</p>
            </div>
          </div>
          <div className="covered-you-sub-flow third-sub">
          <div className="covered-you-img">
             <img className="coverdyou-show-icon" src={coverdyou3} alt="coveredyou icon" />
            </div>
            <div className="coveredyou-content">
              <h1>Support when you need it</h1>
              <p>
              Explore top services" typically refers to discovering or investigating prominent .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maincategory;
