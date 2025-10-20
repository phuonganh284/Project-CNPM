import React from "react";

const About = () => {
    return (
        <div className="w-full h-full flex items-center justify-center text-[#4D4D4D] font-inter">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                    About us
                </h1>
                <p className="text-lg text-gray-600">
                    Welcome to Smart Library, a comprehensive online platform
                    designed to simplify the way users browse, borrow, and manage
                    books efficiently. Our system aims to foster a seamless and
                    enjoyable experience for all library patrons, whether you are
                    searching for your next great read or managing your borrowing
                    history. Beyond serving users, our platform equips library
                    administrators with powerful tools to oversee inventory,
                    process requests, and ensure the smooth operation of library services.
                    By combining user-friendly design with robust functionality,
                    we strive to create a digital library experience that is accessible,
                    efficient, and modern, supporting both lifelong learners and
                    knowledge seekers alike. We are committed to continual improvement
                    and welcome feedback to build a better library community for everyone.
                </p>
            </div>
        </div>
    );
};

export default About;
