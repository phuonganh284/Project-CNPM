import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../data/validations";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/form";

function LoginReader() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // TODO: Implement actual login API call
    navigate("/home");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F3F3F7]">
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

      {/* Form đăng nhập */}
      <div
        className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 
              w-[565px] h-[780px] bg-white rounded-[10px] 
              shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col items-center z-20">

        {/* Logo + tiêu đề */}
        <div className="flex flex-col items-center mt-8">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-[160px] h-[117px] object-contain mb-2"
          />
          <h2 className="font-[Josefin_Sans] text-[28px] leading-[28px] mb-10">
          </h2>
        </div>

        {/* Welcome Back */}
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-[#4D4D4D] font-[Inter] text-[20px] leading-[24px]">
            Welcome Back !
          </h3>
          <p className="text-[#ABABAB] text-[15px] text-center mt-2">
            Sign in as reader to continue to Smart Library
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[422px] mb-8">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-[#4D4D4D] font-[Inter] font-semibold text-[16px]">
                      Email
                    </FormLabel>
                    <FormMessage className="text-red-500 text-sm" />
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="username@collegename.ac.in"
                      className="w-full h-[56px] border rounded-[8px] px-4 text-[#4D4D4D] placeholder:text-gray-400 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-[#4D4D4D] font-[Inter] font-semibold text-[16px]">
                      Password
                    </FormLabel>
                    <FormMessage className="text-red-500 text-sm" />
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-[56px] border rounded-[8px] px-4 pr-12 text-[#4D4D4D] placeholder:text-gray-400 focus:outline-none"
                        {...field}
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
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Remember me + Forgot password */}
            <div className="flex justify-between items-center w-[422px] mb-8">
              <label className="flex items-center gap-2 text-[#4D4D4D] text-[16px]">
                <input type="checkbox" className="w-4 h-4 accent-[#0A385F]" />
                Remember me
              </label>
              <span
                onClick={() => navigate("/send-mail-to-reset-pass")}
                className="text-[#4D4D4D] underline text-[16px] cursor-pointer hover:text-[#3273AF] transition-colors"
              >
                Forgot password?
              </span>
            </div>

            {/* Nút Login */}
            <Button
              type="submit"
              className="w-[422px] h-[48px] bg-[#3273AF] text-white font-semibold rounded-[8px] text-[16px] mb-6 hover:bg-[#275b8c] transition cursor-pointer"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Link đăng ký */}
        <p className="text-[#4D4D4D] text-[16px]">
          New User?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline cursor-pointer hover:text-[#3273AF] transition-colors"
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginReader;
