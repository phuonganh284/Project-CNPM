import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginLibrarian() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim()) newErrors.email = 'Required field';
    if (!formData.password.trim()) newErrors.password = 'Required field';

    return newErrors;
  };

  // Handle login button click
  const handleLogin = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // All fields filled - call login with role 'librarian'
      const result = await login(formData.email, formData.password, 'librarian');
      if (result.success) {
        navigate("/home");
      }
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
      {/* Vector phủ lên */}
      <img
        src="/Vector 2.png"
        alt="overlay"
        className="absolute inset-0 w-full h-full object-cover z-10"
      />

      {/* Khung login */}
      <div
        className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 
              w-[565px] h-[780px] bg-white rounded-[10px] 
              shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col items-center z-20">
        {/* Logo */}
        <img src="/logo.svg" alt="logo" className="w-[130px] mb-3" />
        <h1 className="text-[28px] font-[Josefin_Sans] mb-8">
        </h1>

        {/* Tiêu đề */}
        <h2 className="text-xl font-normal text-[#4D4D4D] mb-1">Welcome Back!</h2>
        <p className="text-sm text-[#ABABAB] mb-10">Sign in as librarian to continue to Smart Library</p>

        {/* Email */}
        <div className="w-full max-w-[420px] mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] text-[16px] font-semibold">Email</label>
            {errors.email && (
              <p className="text-red-500 text-sm">Required field</p>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="username@collegename.ac.in"
            className={`w-full h-[56px] border rounded-lg px-4 text-[#4D4D4D] placeholder:text-gray-400 ${errors.email ? 'border-red-500' : 'border-[#DCD9D9]'
              }`}
          />
        </div>

        {/* Password */}
        <div className="w-full max-w-[420px] mb-6 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#4D4D4D] text-[16px] font-semibold">Password</label>
            {errors.password && (
              <p className="text-red-500 text-sm">Required field</p>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="********"
              className={`w-full h-[56px] border rounded-lg px-4 text-[#4D4D4D] pr-10 placeholder:text-gray-400 ${errors.password ? 'border-red-500' : 'border-[#DCD9D9]'
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

        {/* Extra options */}
        <div className="flex justify-between items-center w-full max-w-[420px] text-[16px] mb-8">
          <label className="flex items-center gap-2 text-[#4D4D4D]">
            <input type="checkbox" className="w-4 h-4" />
            Remember me
          </label>
          <span
            onClick={() => navigate("/send-mail-to-reset-pass")}
            className="text-[#4D4D4D] underline cursor-pointer hover:text-[#3273AF] transition-colors"
          >
            Forgot password?
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full max-w-[420px] h-[48px] bg-[#3273AF] rounded-lg text-white font-semibold text-[16px] hover:bg-[#275b8c] transition-colors cursor-pointer"
        >
          Login
        </button>

      </div>
    </div>
  );
}
