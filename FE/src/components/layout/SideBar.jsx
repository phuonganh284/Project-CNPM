import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const SideBar = ({ isSidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();
    const userRole = user?.role || 'guest';
    const location = useLocation();

    const menuItems = {
        guest: [
            { icon: assets.home_icon, label: 'Home', path: '/home' },
            { icon: assets.browse_icon, label: 'Browse', path: '/browse' },
            { icon: assets.rules_icon, label: 'Rules', path: '/rules' },
        ],

        reader: [
            { icon: assets.home_icon, label: 'Home', path: '/home' },
            { icon: assets.browse_icon, label: 'Browse', path: '/browse' },
            { icon: assets.myrequest_icon, label: 'My Requests', path: '/my-requests' },
            { icon: assets.myborrows_icon, label: 'My Borrows', path: '/my-borrows' },
            { icon: assets.history_icon, label: 'Borrowing History', path: '/borrowing-history' },
            { icon: assets.rules_icon, label: 'Rules', path: '/rules' },
        ],

        librarian: [
            { icon: assets.home_icon, label: 'Home', path: '/home' },
            { icon: assets.browse_icon, label: 'Browse', path: '/browse' },
            { icon: assets.books, label: 'Inventory', path: '/books' },
            { icon: assets.users_icon, label: 'Readers', path: '/users' },
            { icon: assets.borrow_admin_icon, label: 'Borrow Requests', path: '/borrow-requests' },
            { icon: assets.approved_icon, label: 'Approved Requests', path: '/approved-requests' },
            { icon: assets.myborrows_icon, label: 'Borrowing records', path: '/borrowing' },
            { icon: assets.return_icon, label: 'Return Requests', path: '/return-requests' },
            { icon: assets.rules_icon, label: 'Rules', path: '/rules' },
        ],
    };

    const currentMenu = menuItems[userRole] || menuItems.guest;

    return (
        <div
            className={`
                fixed top-0 left-0 h-full bg-white shadow-lg
                w-[280px] z-30 flex flex-col items-start p-6
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:left-6 lg:top-6 lg:h-[calc(100vh-38px)] lg:rounded-2xl lg:rounded-r-none
            `}
        >
            {/* Logo and Close Button */}
            <div className="w-full flex items-center justify-between mb-8 mt-[-20px]">
                <div className="ml-9">
                    <NavLink to="/home" className="flex items-center">
                        <img src="/logo.svg" alt="Library Logo" className="w-[160px] h-auto cursor-pointer" />
                    </NavLink>
                </div>
                <button 
                    className="lg:hidden text-gray-500 hover:text-gray-800"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>


            {/* Nav links */}
            <nav className="mb-auto mt-4 ml-9">
                <ul className="flex flex-col space-y-6">
                    {currentMenu.map((item, index) => (
                        <li key={index} className="group">
                            <NavLink to={item.path} onClick={() => setSidebarOpen(false)}>
                                {({ isActive }) => (
                                    <div className={`
                                        flex items-center space-x-3 cursor-pointer text-lg
                                        transition-all duration-200
                                        ${isActive
                                            ? 'text-[#4D4D4D] font-medium'
                                            : 'text-[#8A8A8A] group-hover:text-[#4D4D4D]'
                                        }
                                    `}>
                                        <img
                                            src={item.icon}
                                            alt={item.label}
                                            className={`
                                                w-5 h-5 transition-all duration-200
                                                ${isActive
                                                    ? '[filter:brightness(0)_saturate(100%)_invert(27%)_sepia(6%)_saturate(268%)_hue-rotate(202deg)_brightness(95%)_contrast(92%)]'
                                                    : '[filter:brightness(0)_saturate(100%)_invert(64%)_sepia(0%)_saturate(415%)_hue-rotate(202deg)_brightness(88%)_contrast(81%)] group-hover:[filter:brightness(0)_sate(100%)_invert(27%)_sepia(6%)_saturate(268%)_hue-rotate(202deg)_brightness(95%)_contrast(92%)]'
                                                }
                                            `}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer links */}
            <nav className="mb-5 mt-2 ml-9">
                <ul className="flex flex-col space-y-3 text-sm">
                    <li>
                        <NavLink
                            to="/about"
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                                transition-colors cursor-pointer
                                ${isActive ? 'text-[#4D4D4D]' : 'text-[#8A8A8A] hover:text-[#4D4D4D]'}
                            `}
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/support"
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                                transition-colors cursor-pointer
                                ${isActive ? 'text-[#4D4D4D]' : 'text-[#8A8A8A] hover:text-[#4D4D4D]'}
                            `}
                        >
                            Support
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/terms"
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                                transition-colors cursor-pointer
                                ${isActive ? 'text-[#4D4D4D]' : 'text-[#8A8A8A] hover:text-[#4D4D4D]'}
                            `}
                        >
                            Terms & Condition
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default SideBar



