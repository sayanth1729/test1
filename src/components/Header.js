import React from "react";

const Header = ({ onLogout }) => {
  return (
    <div className="navbar">
      <span>Home</span>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Header;
