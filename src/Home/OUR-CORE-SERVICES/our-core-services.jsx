import React, { useState, useEffect } from 'react';
import './our-core-services.css'; // import your styling

const Ourcoreservices = () => {
  const [coreServices, setCoreServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coolieno1.in/v1.0/admin/most-booked');
        const data = await response.json();
        setCoreServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='ourcore-main-con'>
      <h2>Our Core <span>Services</span></h2>
      <div className='ourcore-services'>
        {coreServices.map((service, index) => (
          <div key={index} className='sub-core'>
            <div className='sub-core-image'>
              <img
                src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${service.image}`}
                alt={service.name}
              />
            </div>
            <h3 className='ourcore-service-name'>{service.name}</h3>
            <p className='ourcore-service-price'>{service.description}</p>
            <button className='book-now'>BOOK NOW </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ourcoreservices;
