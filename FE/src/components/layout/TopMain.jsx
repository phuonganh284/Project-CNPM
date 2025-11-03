import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from "./SearchBar";
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';

const TopMain = () => {
    const { user } = useAuth();
    const userRole = user?.role || 'guest';
    const isGuest = userRole === 'guest';

    return (
        <div
            className="
                fixed
                left-[304px]
                top-6
                w-[calc(100%-330px)]
                h-[100px]
                bg-[#F3F3F7]
                flex
                items-center
                justify-between
                px-4
                gap-4
            "
        >
            {/* Search Bar - Hiển thị cho tất cả role */}
            <SearchBar />

            {/* Right Section: Guest có Sign In, Reader/Librarian có Notification + User Menu */}
            {isGuest ? (
                <button
                    className="
                        flex 
                        items-center 
                        justify-center 
                        bg-white 
                        rounded-full
                        w-auto
                        min-w-[120px] sm:min-w-[140px] md:min-w-[170px]
                        px-4 sm:px-5 md:px-6
                        h-[42px] sm:h-[46px] md:h-[50px]
                        shadow-sm 
                        hover:bg-gray-100 
                        transition-all
                        duration-200
                        cursor-pointer
                        overflow-hidden
                    "
                >
                    <img
                        src={assets.user_icon}
                        alt="User"
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 md:mr-4"
                    />
                    <span className="text-[#4D4D4D] font-inter text-sm sm:text-[15px] md:text-[16px] whitespace-nowrap">
                        Sign In
                    </span>
                </button>
            ) : (
                <div className="flex items-center gap-4 ml-6">
                    <NotificationDropdown />
                    <UserMenu />
                </div>
            )}
        </div>
    )
}

export default TopMain
