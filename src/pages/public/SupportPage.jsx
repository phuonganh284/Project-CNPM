import React from "react";

const Support = () => {
    return (
        <div className="w-full min-h-screen text-[#4D4D4D] font-inter flex items-center justify-center p-10">
            <div className="bg-white shadow-md rounded-2xl p-10 max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8 text-[#333]">
                    Support
                </h1>

                {/* Intro */}
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    Need help? We’re here to make your Smart Library experience easy and smooth.
                    Browse our FAQs below or contact us directly for assistance.
                </p>

                {/* FAQ Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-[#333]">Frequently Asked Questions</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li>
                            <strong>How can I borrow a book?</strong><br />
                            Simply navigate to the book’s details page and click the “Borrow” button.
                            Make sure you’re logged in to your account.
                        </li>
                        <li>
                            <strong>What happens if I return a book late?</strong><br />
                            Books returned past the due date will be marked as overdue.
                            Repeated overdue returns may temporarily restrict borrowing privileges.
                        </li>
                        <li>
                            <strong>How do I reset my password?</strong><br />
                            Go to the login page and click “Forgot Password.” Follow the instructions sent to your email. Or navigate to the Login & Security tab on your profile page to change password.
                        </li>
                        <li>
                            <strong>How can I contact a librarian?</strong><br />
                            You can email or message us directly through the contact form below.
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-[#333]">Contact Us</h2>
                    <p className="text-gray-700 mb-2">Email: <span className="text-[#4A90E2]">support@smartlibrary.com</span></p>
                    <p className="text-gray-700 mb-2">Phone: (0123) 456 789</p>
                    <p className="text-gray-700">Hours: Mon – Fri, 8:00 AM – 6:00 PM</p>
                </div>

                {/* Feedback Form */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-[#333]">Send a Message</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thank you for reaching out! We'll get back to you soon.");
                            e.target.reset();
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            required
                            className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        />
                        <textarea
                            placeholder="Describe your issue..."
                            rows="4"
                            required
                            className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-[#4A90E2] text-white px-6 py-2 rounded-lg hover:bg-[#3A7BC8] transition-all"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;
