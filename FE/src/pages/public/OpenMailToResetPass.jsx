
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
              
              {/* Demo email link */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">📧 Demo email link:</p>
                <a 
                  href="/reset-password"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/reset-pass');
                  }}
                >
                  http://localhost:5173/reset-password
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  (Trong thực tế, link này sẽ được gửi qua email)
                </p>
              </div>
              
              {/* Test button để redirect đến ResetPass server */}
              <div className="mt-6">
                <button 
                  onClick={() => {
                    console.log('Redirecting to ResetPass page...');
                    navigate('/reset-pass');
                  }}
                  className="bg-[#3273AF] text-white px-6 py-3 rounded-lg hover:bg-[#275b8c] transition-colors cursor-pointer"
                >
                  🔗 Click to Reset Password
                </button>
              </div>
          
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