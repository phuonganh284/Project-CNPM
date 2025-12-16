
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Giả sử bạn có file logo trong thư mục public
const logoUrl = '/logo.svg'; 

// Tên component đã được đổi ở đây
export default function OpenMailToResetPass() {
  const navigate = useNavigate();

  return (
    // Container chính cho toàn bộ trang
    <div className="relative min-h-screen w-full bg-[#F3F3F7] flex items-center justify-center overflow-hidden">
      
      {/* Nền ảnh */}
      <img
        src="/christin-hume-Hcfwew744z4-unsplash.jpg"
        alt=""
        className="absolute w-full h-full object-cover z-0"
      />

      {/* Vector uốn lượn màu xanh */}
      <img
        src="/Vector 2.png"
        alt=""
        className="absolute w-full h-full object-cover z-10"
      />

      {/* Card chính ở giữa */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-12 mx-4 z-20">
        <div className="flex flex-col items-center text-center gap-y-16">
          
          {/* Logo và Tên thương hiệu */}
          <div className="flex flex-col items-center gap-y-4">
            <img src={logoUrl} alt="Smart Library Logo" className="w-40 h-auto" />
            <h1 className="text-3xl font-normal font-['Josefin_Sans']">
            </h1>
          </div>

          {/* Nội dung chính: Thông báo xác nhận */}
              <p className="text-xl font-normal text-[#4D4D4D] leading-relaxed">
                Please open your gmail to complete resetting password
              </p>
              
          {/* Link quay lại Login */}
          <p className="text-base text-[#4D4D4D] mt-8">
            Already a User?{" "}
            <span 
              onClick={() => navigate("/select-role")}
              className="text-[#3273AF] font-semibold hover:underline cursor-pointer transition-colors"
            >
              Login now
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}