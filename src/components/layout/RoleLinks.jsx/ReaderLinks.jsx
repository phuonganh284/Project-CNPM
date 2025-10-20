import React from 'react'
import { assets } from '../../../assets/assets'
import { NavLink } from "react-router-dom";

const ReaderLinks = () => {
    const linkBase = "flex items-center space-x-3 cursor-pointer text-lg transition-colors duration-200";
    const inactiveColor = "text-[#8A8A8A] hover:text-[#4D4D4D]";
    const activeColor = "text-[#4D4D4D] font-semibold";

    return (
        <>
            <nav className="mb-auto mt-4   ml-4">
                <ul className="flex flex-col space-y-5.75">
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.home_icon} alt="Home Icon" className="w-5 h-5" />
                            <span>Home</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/browse"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.browse_icon} alt="Browse Icon" className="w-5 h-5" />
                            <span>Browse</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/myborrows"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.myborrows_icon} alt="MyBorrows Icon" className="w-5 h-5" />
                            <span>My Borrows</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/myrequests"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.myborrows_icon} alt="MyRequests Icon" className="w-5 h-5" />
                            <span>My Requests</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/rules"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.rules_icon} alt="Rules Icon" className="w-5 h-5" />
                            <span>Rules</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Footer links ----------------------------------------------------*/}
            <nav className=" mt-2 ml-4">
                <ul className="flex flex-col space-y-3 text-sm">
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `${isActive ? activeColor : inactiveColor}`
                            }
                        >
                            About
                        </NavLink>
                    </li>

                    <li>
                        <a href="#support" className={`${inactiveColor}`}>Support</a>
                    </li>

                    <li>
                        <a href="#term-condition" className={`${inactiveColor}`}>Terms & Condition</a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default ReaderLinks
