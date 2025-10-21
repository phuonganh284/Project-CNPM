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
      <img
        src="/logo.svg"
        alt="Book Logo"
        className="w-[423px] h-[293px] object-contain hover:scale-105 transition-transform duration-300"
      />
      <h1 className="font-[Josefin_Sans] text-[64px] leading-[64px] mt-6 transition-colors duration-300">
      </h1>
      <p className="text-gray-500 text-lg mt-4 opacity-70">
        Click anywhere to continue
      </p>
    </div>
  );
}

export default Welcome;
