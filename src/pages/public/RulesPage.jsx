import React from 'react';

const RulesPage = () => {
    return (
        <div className="bg-[#F3F3F7] min-h-screen pb-10 -m-4 p-4 mt-2">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 ml-6">
                    <h1 className="text-gray-800 font-inter text-3xl font-bold mb-2">
                        Library Rules & Regulations
                    </h1>
                    <p className="text-gray-600 font-inter text-sm">
                        Please read and follow these guidelines to ensure a pleasant experience for everyone
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8 ml-6">
                    {/* General Rules */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">General Rules</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>All library users must register and obtain a library card</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Maintain silence and avoid disturbing other users</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>No food or drinks are allowed in the library premises</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Mobile phones must be kept on silent mode</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Handle all books and materials with care</span>
                            </li>
                        </ul>
                    </section>

                    {/* Borrowing Rules */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Borrowing Rules</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Maximum of 5 books can be borrowed at a time</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Standard borrowing period is 14 days</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Books can be renewed once if no other reservations exist</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Reference books and special collections cannot be borrowed</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Present your library card when borrowing or returning books</span>
                            </li>
                        </ul>
                    </section>

                    {/* Late Returns & Fines */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Late Returns & Fines</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>Late fee: $0.50 per day per book</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>Maximum fine cap: $10.00 per book</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>Library privileges will be suspended if fines exceed $25.00</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>Lost or damaged books must be paid for at replacement cost</span>
                            </li>
                        </ul>
                    </section>

                    {/* Damage & Loss */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Damage & Loss Policy</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-orange-600 mr-3">•</span>
                                <span>Minor damage (slight wear): Warning only</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-600 mr-3">•</span>
                                <span>Moderate damage (torn pages, water damage): 50% of book value</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-600 mr-3">•</span>
                                <span>Severe damage or loss: Full replacement cost + processing fee</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-600 mr-3">•</span>
                                <span>Report any pre-existing damage when borrowing</span>
                            </li>
                        </ul>
                    </section>

                    {/* Conduct */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Code of Conduct</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3">•</span>
                                <span>Respect library staff and other users</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3">•</span>
                                <span>Return books to designated areas after use</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3">•</span>
                                <span>Report any issues or concerns to staff immediately</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3">•</span>
                                <span>Violation of rules may result in suspension of library privileges</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RulesPage;