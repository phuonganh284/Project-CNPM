import React from "react";

const About = () => {
    return (
        <div className="w-full  flex items-center justify-center text-[#4D4D4D] font-inter  py-8">
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2">
                    <img
                        src="https://www.publishcentral.com.au/wp-content/uploads/2023/05/book-pile-of-must-read-books-scaled1.jpeg"
                        alt="Books"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Section */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">About Us</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Welcome to <span className="font-semibold text-gray-800">Smart Library</span>,
                        a comprehensive online platform designed to simplify the way users browse, borrow,
                        and manage books efficiently.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mt-4">
                        Our system aims to foster a seamless and enjoyable experience for all library patrons,
                        whether you are searching for your next great read or managing your borrowing history.
                        Beyond serving users, our platform equips library administrators with powerful tools to oversee
                        inventory, process requests, and ensure the smooth operation of library services.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mt-4">
                        By combining user-friendly design with robust functionality, we strive to create a digital library
                        experience that is accessible, efficient, and modern, supporting both lifelong learners and knowledge
                        seekers alike. We are committed to continual
                        improvement and welcome feedback to build a better library community for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
