import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'reader'
  });
  
  // Error state
  const [errors, setErrors] = useState({});

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    return newErrors;
  };

  // Handle register button click
  const handleRegister = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // All fields filled - show success message and navigate
      alert("Registration successful! Please login to continue.");
      navigate("/select-role");
    } else {
      // Some fields empty - show errors
      setErrors(validationErrors);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#F3F3F7] overflow-hidden">
      {/* Ảnh nền */}
      <img
        src="/christin-hume-Hcfwew744z4-unsplash.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Vector overlay */}
      <img
        src="/Vector 2.png"
        alt="overlay"
        className="absolute inset-0 w-full h-full object-cover z-10"
      />

      {/* Khung trắng */}
      <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2
                      w-[565px] h-[780px] bg-white rounded-[10px]
                      shadow-[0_0_20px_rgba(0,0,0,0.25)] z-20 px-8 pt-4 flex flex-col items-center">

        {/* Logo */}
        <img src="/logo.svg" alt="logo" className="w-[150px] mb-2" />
        <h1 className="text-[24px] font-[Josefin_Sans] mb-3">

        </h1>

        {/* Tiêu đề */}
        <h2 className="text-[24px] font-semibold text-[#4D4D4D] mb-1">Registration</h2>
        <p className="text-[13px] text-[#ABABAB] mb-4">For Reader</p>

        {/* Email */}
        <div className="w-full max-w-[422px] mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] font-semibold text-[16px]">
              Email ID
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="username@collegename.ac.in"
            className={`w-full h-[48px] border rounded-lg px-4 text-[#4D4D4D] placeholder:text-gray-400 ${
              errors.email ? 'border-red-500' : 'border-[#DCD9D9]'
            }`}
          />
        </div>

        {/* Username */}
        <div className="w-full max-w-[422px] mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] font-semibold text-[16px]">
              Username
            </label>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Userabc"
            className={`w-full h-[48px] border rounded-lg px-4 text-[#4D4D4D] placeholder:text-gray-400 ${
              errors.username ? 'border-red-500' : 'border-[#DCD9D9]'
            }`}
          />
        </div>

        {/* Password */}
        <div className="w-full max-w-[422px] mb-3 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] font-semibold text-[16px]">
              Password
            </label>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="********"
              className={`w-full h-[48px] border rounded-lg px-4 pr-10 text-[#4D4D4D] placeholder:text-gray-400 ${
                errors.password ? 'border-red-500' : 'border-[#DCD9D9]'
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full max-w-[422px] mb-3 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] font-semibold text-[16px]">
              Confirm Password
            </label>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="********"
              className={`w-full h-[48px] border rounded-lg px-4 pr-10 text-[#4D4D4D] placeholder:text-gray-400 ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#DCD9D9]'
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="w-full max-w-[422px] mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] font-semibold text-[16px]">
              Role
            </label>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
          <select 
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={`w-full h-[48px] border rounded-lg px-4 text-[#4D4D4D] ${
              errors.role ? 'border-red-500' : 'border-[#DCD9D9]'
            }`}
          >
            <option value="reader">Reader</option>
          </select>
        </div>

        {/* Button */}
        <button 
          onClick={handleRegister}
          className="w-full max-w-[422px] h-[48px] bg-[#3273AF] text-white font-semibold text-[16px] rounded-lg mb-4 hover:bg-[#275b8c] transition-colors cursor-pointer"
        >
          Register
        </button>

        {/* Link to Login */}
        <p className="text-[#4D4D4D] text-[16px]">
          Already a User?{" "}
          <span
            onClick={() => navigate("/select-role")}
            className="underline cursor-pointer hover:text-[#3273AF] transition-colors"
          >
            Login now
          </span>
        </p>
      </div>
    </div>
  );
}
