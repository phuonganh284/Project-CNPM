import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";

const SearchBar = () => {
    const [filter, setFilter] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const filters = ["All", "Title", "Author"];
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="
                left-6
                relative 
                flex 
                items-center 
                bg-white 
                rounded-full 
                w-[500px] 
                h-[50px] 
                shadow-sm 
                border border-[#E1E1E1] 
                overflow-visible 
                z-50
            "
        >
            {/* Filter Button + Dropdown -------------------------------------------- */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                        flex 
                        items-center 
                        justify-between 
                        bg-[#F3F3F7] 
                        px-4 
                        py-[14.4445px]
                        rounded-l-full 
                        rounded-r-none
                        text-[#4D4D4D] 
                        text-sm 
                        cursor-pointer
                        font-inter
                    "
                >
                    {filter}
                    <img src={assets.polygon_icon} alt="Polygon Icon" className="w-3 h-3 ml-3" />
                </button>

                {isOpen && (
                    <ul
                        className="
                            absolute top-[55px] -left-4
                            bg-white rounded-lg shadow-lg 
                            border border-gray-200 
                            w-[120px] 
                            text-[#4D4D4D] text-sm font-inter 
                            z-50
                        "
                    >
                        {filters.map((option) => (
                            <li
                                key={option}
                                onClick={() => {
                                    setFilter(option);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Search Input -----------------------------------------------------------*/}
            <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 ml-5 outline-none text-[#4D4D4D] placeholder-[#CCCCCC] font-inter bg-transparent"
            />

            {/* Search Button -----------------------------------------------------------*/}
            <button
                onClick={() => alert(`Searching for "${searchText}" in ${filter}`)}
                className="
                    flex 
                    items-center 
                    justify-center 
                    px-4
                    bg-[#F3F3F7]   
                    py-[14.4445px]
                    rounded-r-full 
                    rounded-l-none 
                "
            >
                <img
                    src={assets.search_icon}
                    alt="Search"
                    className="w-5 h-5 cursor-pointer hover:opacity-60"
                />
            </button>
        </div>
    );
};

export default SearchBar;
