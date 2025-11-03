import React from 'react'
import { assets } from '../../assets/assets'

const Background = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden">
            <img
                src={assets.background}
                alt="Background"
                className="w-full h-full object-cover"
            />
        </div>
    )
}

export default Background
