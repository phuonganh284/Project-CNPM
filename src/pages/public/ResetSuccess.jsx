
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Icon dấu tick (thay thế bằng icon của bạn nếu muốn)
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-16 h-16 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);


export default function ResetSuccess({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  // Handle back to login
  const handleBackToLogin = () => {
    if (onClose) {
      onClose(); // Nếu được sử dụng như modal
    } else {
      navigate("/select-role"); // Nếu được sử dụng như trang độc lập
    }
  };

  // Nếu modal không được mở, không render gì cả (chỉ khi được sử dụng như modal)
  if (isOpen === false) {
    return null;
  }

  // Nếu được sử dụng như modal (có prop isOpen)
  if (isOpen !== undefined) {
    return (
      // Lớp phủ nền màu đen mờ
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // Bấm ra ngoài để đóng
      >
        {/* Hộp thoại (modal panel) */}
        <div 
          className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center gap-y-6"
          onClick={(e) => e.stopPropagation()} // Ngăn việc bấm vào modal làm nó đóng lại
        >
        {/* Vòng tròn chứa icon */}
        <div className="w-24 h-24 bg-[#4AC156] rounded-full flex items-center justify-center">
          <CheckIcon />
        </div>

        {/* Thông báo */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Process Completed
        </h2>
        <p className="text-gray-600">
          Please click the button below to go back to the Login page.
        </p>

        {/* Nút Back */}
        <button
          onClick={handleBackToLogin}
          className="w-full bg-[#3273AF] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors mt-4"
        >
          Back to Login
        </button>
        </div>
      </div>
    );
  }

  // Nếu được sử dụng như trang độc lập (không có prop isOpen)
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center gap-y-6">
        {/* Vòng tròn chứa icon */}
        <div className="w-24 h-24 bg-[#4AC156] rounded-full flex items-center justify-center">
          <CheckIcon />
        </div>

        {/* Thông báo */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Process Completed
        </h2>
        <p className="text-gray-600">
          Please click the button below to go back to the Login page.
        </p>

        {/* Nút Back */}
        <button
          onClick={handleBackToLogin}
          className="w-full bg-[#3273AF] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors mt-4"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}