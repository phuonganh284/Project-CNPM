import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets'
import SearchBar from "./SearchBar";
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';

const TopMain = ({ searchTerm, setSearchTerm, filter, setFilter, toggleSidebar }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userRole = user?.role || 'guest';
    const isGuest = userRole === 'guest';

    const handleSignIn = () => {
        navigate('/login-reader');
    };

    const handleSearch = () => {
        navigate(`/browse?q=${searchTerm}&filter=${filter}`);
    };

    return (
        <div className="w-full h-[100px] bg-transparent flex items-center justify-between px-4 gap-4">
            <div className="flex items-center gap-4">
                {/* Hamburger Menu Button - visible only on small screens */}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-600 hover:text-gray-800 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                {/* Search Bar - Hiển thị cho tất cả role */}
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                    handleSearch={handleSearch}
                />
            </div>


            {/* Right Section: Guest có Sign In, Reader/Librarian có Notification + User Menu */}
            {isGuest ? (
                <button
                    onClick={handleSignIn}
                    className="
                        flex 
                        items-center 
                        justify-center 
                        bg-white 
                        rounded-full
                        w-auto
                        min-w-[120px]
                        px-4
                        h-[42px] sm:h-[46px]
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
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                    />
                    <span className="text-[#4D4D4D] font-inter text-sm sm:text-[15px] whitespace-nowrap">
                        Sign In
                    </span>
                </button>
            ) : (
                <div className="flex items-center gap-4">
                    <NotificationDropdown />
                    <UserMenu />
                </div>
            )}
        </div>
    )
}

export default TopMain
