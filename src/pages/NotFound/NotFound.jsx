import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          Oops! There's an error. You might've hit a typo or found an old link
          floating around.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
