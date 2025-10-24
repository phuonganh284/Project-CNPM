import React from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/select-role");
  };

  return (
    <div
      onClick={handleClick}
      className="w-screen h-screen flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-300"
    >
      <div className="text-center">
        <img
          src="/logo_notext.svg"
          alt="Book Logo"
          className="w-[423px] h-[293px] object-contain hover:scale-105 transition-transform duration-300 mx-auto"
          onError={(e) => {
            console.error("Logo failed to load");
            e.target.style.display = 'none';
          }}
        />
        <p className="text-gray-500 text-lg mt-4 opacity-70">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}

export default Welcome;
