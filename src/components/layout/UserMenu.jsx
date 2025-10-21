import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        // TODO: KHI CÓ BE - Redirect về login page hoặc gọi API logout
        // await fetch('/api/auth/logout', { method: 'POST' });
        // navigate('/login');
        window.location.href = '/?role=guest';
    };

    // TODO: KHI CÓ BE - Lấy user info từ API
    // const { data: userInfo } = useQuery(['user'], fetchUserProfile);
    // const userName = userInfo?.name || 'User';
    const userRole = user?.role || 'guest';
    const userName = user?.name || (userRole === 'librarian' ? 'Librarian' : 'Reader');

    return (
        <div className="relative z-[60]" ref={dropdownRef}>
            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex 
                    items-center 
                    justify-center
                    gap-3
                    w-[190px] 
                    h-[50px]
                    bg-white 
                    rounded-full
                    shadow-sm
                    hover:bg-gray-50
                    transition-all
                    duration-200
                    px-3
                    cursor-pointer
                "
            >
                {/* Avatar */}
                <img
                    src={assets.user_icon}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-300"
                />

                {/* User Name */}
                <span className="text-[#4D4D4D] font-inter text-[15px]  font-medium flex-1 text-left">
                    {userName}
                </span>

                {/* Dropdown Arrow */}
                <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z" fill="#4D4D4D" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="
                    absolute 
                    top-[58px] 
                    right-0
                    w-[203px]
                    bg-white 
                    rounded-2xl 
                    shadow-xl
                    border border-gray-200
                    overflow-hidden
                    z-50
                    animate-in fade-in slide-in-from-top-2 duration-200

                ">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-[#4D4D4D] font-inter text-sm font-semibold">
                            {userName}
                        </p>
                        <p className="text-gray-500 font-inter text-xs capitalize">
                            {userRole}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {/* Profile */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // TODO: KHI CÓ BE - Navigate to profile page
                                // navigate('/profile');
                                console.log('Navigate to profile');
                            }}
                            className="
                                w-full
                                px-4 py-3
                                flex items-center gap-3
                                text-[#4D4D4D]
                                hover:bg-gray-50
                                transition-colors
                                text-left
                                cursor-pointer
                            "
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#4D4D4D" />
                                <path d="M10 12.5C5.58172 12.5 2 14.5817 2 17.5V20H18V17.5C18 14.5817 14.4183 12.5 10 12.5Z" fill="#4D4D4D" />
                            </svg>
                            <span className="font-inter text-sm">Profile</span>
                        </button>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-gray-200"></div>

                        {/* Sign Out */}
                        <button
                            onClick={handleLogout}
                            className="
                                w-full
                                px-4 py-3
                                flex items-center gap-3
                                text-red-600
                                hover:bg-red-50
                                transition-colors
                                text-left
                                cursor-pointer
                            "
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H13C14.1 20 15 19.1 15 18V16H13V18H2V2H13V4H15V2C15 0.9 14.1 0 13 0Z" fill="#DC2626" />
                                <path d="M17.5 9H6.5V11H17.5L14.5 14L15.91 15.41L21.32 10L15.91 4.59L14.5 6L17.5 9Z" fill="#DC2626" />
                            </svg>
                            <span className="font-inter text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
