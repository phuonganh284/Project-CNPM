import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Giả sử bạn có file logo trong thư mục public
const logoUrl = '/logo.svg';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: 'Required field' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      // Lưu email vào localStorage để ResetPass có thể sử dụng
      localStorage.setItem('resetEmail', email);
      console.log('Email saved to localStorage:', email);
      navigate("/open-mail-to-reset-pass");
    }
  };

  return (
    // 1. Container chính cho toàn bộ trang
    <div className="relative min-h-screen w-full bg-[#F3F3F7] flex items-center justify-center overflow-hidden">
      
      {/* 2. Nền ảnh */}
      <img
        src="/christin-hume-Hcfwew744z4-unsplash.jpg"
        alt=""
        className="absolute w-full h-full object-cover z-0"
      />

      {/* 3. Vector uốn lượn màu xanh */}
      <img
        src="/Vector 2.png"
        alt=""
        className="absolute w-full h-full object-cover z-10"
      />

      {/* 4. Card chính ở giữa */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-12 mx-4 z-20">
        <div className="flex flex-col items-center text-center gap-y-8">
          
          {/* Logo và Tên thương hiệu */}
          <div className="flex flex-col items-center gap-y-4">
            <img src={logoUrl} alt="Smart Library Logo" className="w-40 h-auto" />
            <h1 className="text-3xl font-normal font-['Josefin_Sans']">

            </h1>
          </div>

          {/* Tiêu đề và mô tả */}
          <div className="flex flex-col gap-y-2">
            <h2 className="text-xl font-normal text-[#4D4D4D]">
              Reset password
            </h2>
            <p className="text-sm text-[#ABABAB]">
              Please send us your Email to reset password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-6">
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="email" className="block text-base font-semibold text-[#4D4D4D]">
                  Email
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm">Required field</p>
                )}
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="username@collegename.ac.in"
                className={`w-full px-4 py-4 border rounded-lg text-[#4D4D4D] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.email ? 'border-red-500' : 'border-[#DCD9D9]'
                }`}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#3273AF] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              Send
            </button>
          </form>

          {/* Link quay lại Login */}
          <p className="text-base text-[#4D4D4D] mt-4">
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