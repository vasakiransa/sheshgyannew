import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export default Card;
