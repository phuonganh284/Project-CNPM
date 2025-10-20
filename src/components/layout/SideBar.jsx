import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from "react-router-dom";

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
            <div className="mb-8 mt-[-20px] ml-9">
                <NavLink to="/home" className="flex items-center sidebar-link">
                    <img src={assets.logo} alt="Library Logo" className="w-[160px] h-auto cursor-pointer" />
                </NavLink>
            </div>

            {/* Nav links -------------------------------------------------------*/}
            <nav className="mb-auto mt-4 ml-9">
                <ul className="flex flex-col space-y-6">
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? activeColor : inactiveColor}`
                            }
                        >
                            <img src={assets.home_icon} alt="Home Icon" className="w-5 h-5" />
                            <span>Home</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/browse"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? activeColor : inactiveColor}`
                            }
                        >
                            <img src={assets.browse_icon} alt="Browse Icon" className="w-5 h-5" />
                            <span>Browse</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/rules"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? activeColor : inactiveColor}`
                            }
                        >
                            <img src={assets.rules_icon} alt="Rules Icon" className="w-5 h-5" />
                            <span>Rules</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Footer links ----------------------------------------------------*/}
            <nav className="mb-5 mt-2 ml-9">
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
        </div>
    )
}

export default SideBar
