import React from "react";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  const handleReaderClick = () => {
    navigate("/login-reader");
  };

  const handleAdminClick = () => {
    navigate("/login-librarian");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F3F3F7]">

      {/* Nền trắng sáng */}
      <img
        src="/christin-hume-Hcfwew744z4-unsplash.jpg"
        alt=""
        className="absolute w-full h-full object-cover z-0"
      />

      {/* Lớp uốn lượn màu xanh (Vector 2) */}
      <img
        src="/Vector 2.png"
        alt=""
        className="absolute w-full h-full object-cover z-10"
      />

      {/* Thẻ đăng nhập */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[660px] bg-white rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.25)]
                      flex flex-col items-center justify-center py-12 z-20">

        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-[200px] h-auto object-contain mb-6"
        />
        <h2 className="font-[Josefin_Sans] text-[28px] leading-[28px] mb-8">
        </h2>

        {/* Tiêu đề */}
        <h1 className="text-[#0A385F] font-[Inter] text-[48px] text-center mb-12">
          LOG IN AS
        </h1>

        {/* Nút Reader */}
        <button 
          onClick={handleReaderClick}
          className="w-[209px] h-[61px] bg-[#3273AF] rounded-[5px]
                           text-white font-[Inter] font-semibold text-[20px]
                           mb-6 hover:bg-[#275b8c] transition cursor-pointer">
          Reader
        </button>

        {/* Nút Librarian */}
        <button 
          onClick={handleAdminClick}
          className="w-[209px] h-[61px] bg-[#3273AF] rounded-[5px]
                           text-white font-[Inter] font-semibold text-[20px]
                           hover:bg-[#275b8c] transition cursor-pointer">
          Librarian
        </button>
      </div>
    </div>
  );
}

export default SelectRole;
