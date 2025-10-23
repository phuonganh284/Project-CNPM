import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const SideBar = () => {
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
            { icon: assets.myborrows_icon, label: 'My Borrows', path: '/my-borrows' },
            { icon: assets.myrequest_icon, label: 'My Requests', path: '/my-requests' },
            { icon: assets.rules_icon, label: 'Rules', path: '/rules' },
        ],

        librarian: [
            { icon: assets.home_icon, label: 'Home', path: '/home' },
            { icon: assets.browse_icon, label: 'Browse', path: '/browse' },
            { icon: assets.books, label: 'Manage Books', path: '/books' },
            { icon: assets.users_icon, label: 'Manage Readers', path: '/users' },
            { icon: assets.borrow_admin_icon, label: 'Borrow Requests', path: '/borrow-requests' },
            { icon: assets.approved_icon, label: 'Approved Requests', path: '/approved-requests' },
            { icon: assets.return_icon, label: 'Return Requests', path: '/return-requests' },
            { icon: assets.myborrows_icon, label: 'Borrowing records', path: '/borrowing' },
            { icon: assets.rules_icon, label: 'Rules', path: '/rules' },
        ],
    };

    const currentMenu = menuItems[userRole] || menuItems.guest;

    return (
        <div
            className="
                fixed
                left-6
                top-6
                w-[250px]
                md:w-[280px]
                h-[calc(100vh-38px)]
                bg-white
                rounded-2xl
                rounded-r-none
                flex
                flex-col
                items-start
                p-6
                shadow-md
                z-10
            "
        >
            {/* Logo */}
            <div className="mb-8 mt-[-20px] ml-9">
                <NavLink to="/home" className="flex items-center">
                    <img src="/logo.svg" alt="Library Logo" className="w-[160px] h-auto cursor-pointer" />
                </NavLink>
            </div>

            {/* Nav links */}
            <nav className="mb-auto mt-4 ml-9">
                <ul className="flex flex-col space-y-6">
                    {currentMenu.map((item, index) => (
                        <li key={index} className="group">
                            <NavLink to={item.path}>
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
                                                    : '[filter:brightness(0)_saturate(100%)_invert(64%)_sepia(0%)_saturate(415%)_hue-rotate(202deg)_brightness(88%)_contrast(81%)] group-hover:[filter:brightness(0)_saturate(100%)_invert(27%)_sepia(6%)_saturate(268%)_hue-rotate(202deg)_brightness(95%)_contrast(92%)]'
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



