import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="w-full min-h-screen  flex justify-center py-16 px-6 text-[#4D4D4D] font-inter">
            <div className="max-w-3xl bg-white p-10 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Terms and Conditions
                </h1>

                <p className="text-gray-600 mb-6">
                    Welcome to <span className="font-semibold text-[#4A90E2]">Smart Library</span>.
                    By accessing or using our platform, you agree to comply with the following terms
                    and conditions. Please read them carefully before using our services.
                </p>

                {/* Section 1 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">1. User Accounts</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Users must provide accurate and up-to-date information when registering.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>Smart Library reserves the right to suspend or terminate accounts involved in misuse or fraudulent activities.</li>
                </ul>

                {/* Section 2 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">2. Borrowing Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Books can be borrowed for a standard loan period of 14 days unless otherwise stated.</li>
                    <li>Borrowers must return books on or before the due date to avoid penalties.</li>
                    <li>Users with overdue books may be temporarily restricted from borrowing further items.</li>
                </ul>

                {/* Section 3 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">3. Overdue and Fines</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Overdue items may result in suspension of borrowing privileges.</li>
                    <li>Continuous failure to return borrowed books may lead to account review or banning.</li>
                </ul>

                {/* Section 4 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">4. Banned Accounts</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Librarians reserve the right to ban users who repeatedly break library rules or damage materials.</li>
                    <li>Users will be notified of any account suspension or ban.</li>
                </ul>

                {/* Section 5 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">5. Content and Usage</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>All content on Smart Library, including images, text, and design, is owned or licensed by Smart Library.</li>
                    <li>Users may not copy, distribute, or use materials for commercial purposes without written permission.</li>
                </ul>

                {/* Section 6 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">6. Privacy</h2>
                <p className="text-gray-600">
                    We value your privacy and collect personal data only for library operations and user management.
                    Your information will not be shared with third parties without your consent.
                </p>

                {/* Section 7 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">7. Changes to Terms</h2>
                <p className="text-gray-600">
                    Smart Library may revise these Terms and Conditions at any time. Users are encouraged
                    to review this page periodically to stay informed of updates.
                </p>

                {/* Section 8 */}
                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">8. Contact Information</h2>
                <p className="text-gray-600">
                    For any questions or concerns regarding these Terms, please contact us at: <br />
                    <span className="font-medium text-[#4A90E2]">support@smartlibrary.com</span>
                </p>

                <div className="mt-10 text-center text-sm text-gray-500">
                    Last updated: October 2025
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
