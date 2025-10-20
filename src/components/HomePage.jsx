import React from "react";
import { assets } from '../assets/assets'
import IntroBox from './IntroBox'


const HomePage = () => {
    return (
        <div
            className="
                bg-[#F3F3F7]
                flex
                flex-col
                md:flex-row
                px-0
                md:px-10
                gap-4
                -z-15
                overflow-auto
            "
        >
            <ul>
                <IntroBox />
                <IntroBox />
                <IntroBox />
                <IntroBox />
            </ul>




        </div>
    )
}

export default HomePage;
