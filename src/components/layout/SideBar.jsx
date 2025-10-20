import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from "react-router-dom";
import GuestLinks from './RoleLinks.jsx/GuestLinks';
import ReaderLinks from './RoleLinks.jsx/ReaderLinks';
import LibrarianLinks from './RoleLinks.jsx/LibrarianLinks'

const SideBar = () => {
    const linkBase = "flex items-center space-x-3 cursor-pointer text-lg transition-colors duration-200";
    const inactiveColor = "text-[#8A8A8A] hover:text-[#4D4D4D]";
    const activeColor = "text-[#4D4D4D] font-semibold";

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
            {/* Logo ------------------------------------------------------------*/}
            <div className="mb-8 mt-[-25px] ml-9">
                <NavLink to="/home" className="flex items-center sidebar-link">
                    <img src={assets.logo} alt="Library Logo" className="w-[160px] h-auto cursor-pointer" />
                </NavLink>
            </div>

            <LibrarianLinks />
        </div>
    )
}

export default SideBar
