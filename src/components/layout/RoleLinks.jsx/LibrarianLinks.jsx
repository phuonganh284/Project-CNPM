import React from 'react'
import { assets } from '../../../assets/assets'
import { NavLink } from "react-router-dom";

const LibrarianLinks = () => {
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
                            to="/managebooks"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.managebooks_icon} alt="ManageBooks Icon" className="w-5 h-5" />
                            <span>Manage Books</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/manageusers"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.manageusers_icon} alt="ManageUsers Icon" className="w-5 h-5" />
                            <span>Manage Users</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/borrowrequests"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.myborrows_icon} alt="BorrowRequests Icon" className="w-5 h-5" />
                            <span>Borrow Requests</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/approvedrequests"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.approvedreq_icon} alt="ApprovedRequests Icon" className="w-5 h-5" />
                            <span>Approved Requests</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/returnrequests"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.returnreq_icon} alt="ReturnRequests Icon" className="w-5 h-5" />
                            <span>Return Requests</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/borrowrecords"
                            className={({ isActive }) => `${linkBase} ${isActive ? activeColor : inactiveColor}`}
                        >
                            <img src={assets.borrowrecords_icon} alt="BorrowRecords Icon" className="w-5 h-5" />
                            <span>Borrow Records</span>
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

export default LibrarianLinks
