import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from "react-router-dom";
const SideBar = () => {
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
            <div className="mb-8 mt-[-20px] ml-9">
                <Link to="/home" className="flex items-center sidebar-link">
                    <img src={assets.logo} alt="Library Logo" className="w-[160px] h-auto cursor-pointer" />
                </Link>
            </div>

            {/* Nav links -------------------------------------------------------*/}
            <nav className="mb-auto mt-4 ml-9">
                <ul className="flex flex-col space-y-6 text-[#8A8A8A]">
                    <li className="flex items-center space-x-3 cursor-pointer hover:text-[#4D4D4D] text-lg">
                        <img src={assets.home_icon} alt="Home Icon" className="w-5 h-5" />
                        <Link to="/home" className="sidebar-link">Home</Link>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:text-[#4D4D4D] text-lg">
                        <img src={assets.browse_icon} alt="Browse Icon" className="w-5 h-5" />
                        <a href="#browse">Browse</a>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:text-[#4D4D4D] text-lg">
                        <img src={assets.rules_icon} alt="Rules Icon" className="w-5 h-5" />
                        <a href="#rules">Rules</a>
                    </li>
                </ul>
            </nav>

            {/* Footer links ----------------------------------------------------*/}
            <nav className="mb-5 mt-2 ml-9">
                <ul className="flex flex-col space-y-3 text-[#8A8A8A] text-sm">
                    <li className="hover:text-[#4D4D4D]">
                        <Link to="/about" className="sidebar-link">About</Link>
                    </li>
                    <li className="hover:text-[#4D4D4D]">
                        <a href="#support">Support</a>
                    </li>
                    <li className="hover:text-[#4D4D4D]">
                        <a href="#term-condition">Terms & Condition</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default SideBar
