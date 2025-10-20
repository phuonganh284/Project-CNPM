import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from "./SearchBar";
import Background from './Background';

const TopMain = () => {
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
                flex-col
                md:flex-row
                items-center
                justify-between
                md:px-8
                gap-4
                
            "
        >
            {/* Search Bar----------------------------------------------- */}
            <SearchBar />

            {/* Sign In Button------------------------------------------- */}
            <button
                className="
                    flex 
                    items-center 
                    justify-center 
                    bg-white 
                    rounded-full
                    w-full 
                    md:w-[170px] 
                    h-[50px] 
                    shadow-sm 
                    hover:bg-gray-100 
                    transition
                    mr-2
                    cursor-pointer
                    overflow-hidden
                "
            >
                <img src={assets.user_icon} alt="User" className="w-6 h-6 mr-5" />
                <span className="text-[#4D4D4D] font-inter text-[16px]">Sign In</span>
            </button>
        </div>
    )
}

export default TopMain
