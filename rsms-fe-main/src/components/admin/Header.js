import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        {/* <h1 className="text-2xl font-bold text-gray-800">RSMS Admin Panel</h1> */}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
