import React from "react";
import { assets } from '../assets/assets'


const IntroBox = () => {
    return (
        <div
            className="
                    w-[450px]
                    h-[200px]
                    rounded-2xl
                    bg-gradient-to-r from-[#A5B6CE] to-[#576D91]
                    shadow-md
                    flex
                    items-center
                    justify-center
                    mt-4
                "
        >
            <ul>
                <p className="text-white text-2xl text-center mb-4 ">
                    Smart Library
                </p>
                <div
                    className="
                        w-[400px]
                        h-[1.2px]
                        bg-white
                        mt-0">

                </div>
                <p className="text-white text-lg text-center mt-8" >
                    Borrow, return, and track your books with ease.
                </p>
            </ul>
        </div>
    )
}

export default IntroBox
