import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Surprise = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSmirkClick = () => {
    navigate('/cat-smirk');
  };

  return (
    <div className="surprise-container dark-theme">
      <button className="back-button dark-back" onClick={handleBack}>
        ← Back
      </button>
      
      <div className="content">
        <h1 className="glowing-text">ill show u my noodes pls be in a closed room !</h1>
        
        <button className="smirk-button dark-red" onClick={handleSmirkClick}>
          see my noodes and dihhh
        </button>
      </div>
    </div>
  );
};

export default Surprise;