import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetSuccess from './ResetSuccess';

// Giả sử bạn có file logo trong thư mục public
const logoUrl = '/logo.svg'; 

// Icon con mắt (bạn có thể thay thế bằng icon từ thư viện hoặc file SVG của riêng bạn)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);


export default function ResetPass() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '', // Khởi tạo trống
    password: '',
    confirmPassword: ''
  });

  // Debug: Log email khi component mount và auto-fill
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    console.log('ResetPass mounted - Email from localStorage:', savedEmail);
    
    // Auto-fill email từ localStorage nếu có
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail
      }));
      console.log('Email auto-filled:', savedEmail);
    }
  }, []);
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Success overlay state
  const [showSuccess, setShowSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle success overlay close
  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Navigate to reset success page
    navigate("/reset-success");
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Required field';
    if (!formData.password.trim()) newErrors.password = 'Required field';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Required field';

    // Check if password and confirm password match
    if (formData.password.trim() && formData.confirmPassword.trim() &&
        formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Please make sure your password match.';
    }

    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // All fields filled and passwords match - success
      console.log("Reset password data:", formData);
      // TODO: Implement actual password reset API call
      // Clear localStorage after successful reset
      localStorage.removeItem('resetEmail');
      // Show success overlay
      setShowSuccess(true);
    } else {
      // Some fields empty or passwords don't match - show errors
      setErrors(validationErrors);
    }
  };

  return (
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
        <div className="flex flex-col items-center text-center gap-y-8">
          
          {/* Logo và Tên thương hiệu */}
          <div className="flex flex-col items-center gap-y-4">
            <img src={logoUrl} alt="Smart Library Logo" className="w-40 h-auto" />
            <h1 className="text-3xl font-normal font-['Josefin_Sans']">

            </h1>
          </div>

          {/* Tiêu đề */}
          <h2 className="text-xl font-normal text-[#4D4D4D]">Please change your password</h2>
          
          {/* Security Warning */}
          {localStorage.getItem('resetEmail') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                ⚠️ <strong>Bảo mật:</strong> Email đã được xác thực từ liên kết reset password. 
                Chỉ tiếp tục nếu đây là tài khoản của bạn.
              </p>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-5 mt-4">
            {/* Trường Email */}
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="email" className="block text-base font-semibold text-[#4D4D4D]">Email</label>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="username@collegename.ac.in"
                autoComplete="off"
                readOnly={!!localStorage.getItem('resetEmail')}
                className={`w-full px-4 py-4 border rounded-lg text-[#4D4D4D] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.email ? 'border-red-500' : 'border-[#DCD9D9]'
                } ${localStorage.getItem('resetEmail') ? 'bg-gray-50' : ''}`}
              />
              {localStorage.getItem('resetEmail') && (
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-green-600">
                    🔒 Email đã được xác thực từ liên kết reset password
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('resetEmail');
                      setFormData(prev => ({ ...prev, email: '' }));
                      console.log('Email cleared manually');
                    }}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            
            {/* Trường Password */}
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-base font-semibold text-[#4D4D4D]">Password</label>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className={`w-full px-4 py-4 border rounded-lg text-[#4D4D4D] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12 ${
                    errors.password ? 'border-red-500' : 'border-[#DCD9D9]'
                  }`}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-4 flex items-center">
                  {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Trường Confirm Password */}
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="confirmPassword" className="block text-base font-semibold text-[#4D4D4D]">Confirm Password</label>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  className={`w-full px-4 py-4 border rounded-lg text-[#4D4D4D] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#DCD9D9]'
                  }`}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-4 flex items-center">
                  {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#3273AF] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
              Reset Password
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
      
      {/* ResetSuccess Overlay */}
      <ResetSuccess 
        isOpen={showSuccess} 
        onClose={handleSuccessClose} 
      />
    </div>
  );
}