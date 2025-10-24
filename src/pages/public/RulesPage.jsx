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
                                <span><strong>Standard borrowing period is 1 month (30 days)</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Books can be renewed once for an additional 14 days if no other reservations exist</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span><strong>Each book can only be borrowed 1 copy per user</strong> (cannot borrow multiple copies of the same title)</span>
                            </li>
                        </ul>
                    </section>

                    {/* Pickup & Request Rules */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Borrow Request & Pickup</h2>
                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-600 text-xl">⚠️</span>
                                <div>
                                    <p className="font-semibold text-yellow-800 mb-2">Pickup Deadline</p>
                                    <p className="text-gray-700">
                                        After submitting a borrow request and selecting a pickup date, 
                                        <strong className="text-yellow-800"> you must pick up the book before 8:00 PM (20:00) on the selected date</strong>.
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        ❌ If you do not pick up by 8:00 PM, your request will be <strong>automatically cancelled</strong> 
                                        and the book will be made available for other users.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Submit borrow request through the system and select your preferred pickup date</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Wait for librarian approval (usually within 24 hours)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Once approved, come to the library counter on your selected date</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span><strong>Pickup window: Library opening hours until 8:00 PM</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Present your library card to collect the book</span>
                            </li>
                        </ul>
                    </section>

                    {/* Return & Payment Process */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Return & Payment Process</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">📍 All returns and payments must be done at the library counter</h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                                    <div>
                                        <p className="font-medium">Reader brings book(s) to the counter</p>
                                        <p className="text-sm text-gray-600">Hand over the physical book(s) to the librarian</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                                    <div>
                                        <p className="font-medium">Librarian assesses book condition</p>
                                        <p className="text-sm text-gray-600">Check for damage, calculate overdue fees if applicable</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                                    <div>
                                        <p className="font-medium">Reader pays any fees (if applicable)</p>
                                        <p className="text-sm text-gray-600">Cash payment at counter for overdue or damage fees</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                                    <div>
                                        <p className="font-medium">Librarian clicks "Return Book" in system</p>
                                        <p className="text-sm text-gray-600">Transaction is completed and recorded</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span><strong>No online returns</strong> - Physical book must be returned to library</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span><strong>Payment methods:</strong> Cash only at the counter</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-3">•</span>
                                <span>Receipt will be provided for all payments</span>
                            </li>
                        </ul>
                    </section>

                    {/* Late Returns & Fines */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Late Returns & Fines</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-red-800 mb-3">📅 Overdue Fee Calculation</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-medium">Formula: <span className="text-red-600">Days late × Rate% × Book price</span></p>
                                <ul className="space-y-1 ml-4">
                                    <li>• <strong>Rate:</strong> 0.5% - 5% of book price per day (librarian adjusts)</li>
                                    <li>• <strong>Example:</strong> 3 days late × 1% × 1,125,000 đ = 33,750 đ</li>
                                    <li>• <strong>Book price:</strong> Varies by book (check book details)</li>
                                </ul>
                                <p className="text-sm italic text-red-700 mt-3">
                                    * The percentage rate is determined by librarian based on book value and overdue duration
                                </p>
                            </div>
                        </div>
                        <ul className="mt-4 space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>Library privileges will be suspended if unpaid fines exceed 500,000 đ</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-3">•</span>
                                <span>All fees must be paid before borrowing new books</span>
                            </li>
                        </ul>
                    </section>

                    {/* Damage & Loss */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Damage & Loss Policy</h2>
                        <p className="text-gray-700 mb-4">
                            Damage fees are calculated as a <strong>percentage of the book's purchase price</strong>. 
                            The librarian will assess the damage level and apply the appropriate rate.
                        </p>
                        <div className="space-y-3">
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-green-700 font-semibold">✓ OK Condition</span>
                                    <span className="text-green-700 font-bold">0%</span>
                                </div>
                                <p className="text-sm text-gray-700">No visible damage, normal wear from reading</p>
                                <p className="text-xs text-gray-600 mt-1"><strong>Charge:</strong> None</p>
                            </div>
                            
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-yellow-700 font-semibold">⚠ MINOR Damage</span>
                                    <span className="text-yellow-700 font-bold">5-10%</span>
                                </div>
                                <p className="text-sm text-gray-700">Slight wear, small stains, minor creases on pages or cover</p>
                                <p className="text-xs text-gray-600 mt-1"><strong>Examples:</strong> Coffee stain on corner, bent cover, small pen marks</p>
                                <p className="text-xs text-green-700 mt-1"><strong>Charge:</strong> 5-10% of book price (e.g., 56,250 - 112,500 đ for a 1,125,000 đ book)</p>
                            </div>
                            
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-orange-700 font-semibold">⚠ MODERATE Damage</span>
                                    <span className="text-orange-700 font-bold">20-40%</span>
                                </div>
                                <p className="text-sm text-gray-700">Torn pages, water damage, broken spine, multiple stains</p>
                                <p className="text-xs text-gray-600 mt-1"><strong>Examples:</strong> Ripped pages, water warped pages, detached cover</p>
                                <p className="text-xs text-orange-700 mt-1"><strong>Charge:</strong> 20-40% of book price (e.g., 225,000 - 450,000 đ for a 1,125,000 đ book)</p>
                            </div>
                            
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-red-700 font-semibold">✗ SEVERE Damage</span>
                                    <span className="text-red-700 font-bold">60-80%</span>
                                </div>
                                <p className="text-sm text-gray-700">Major damage making book barely usable, many missing/destroyed pages</p>
                                <p className="text-xs text-gray-600 mt-1"><strong>Examples:</strong> Extensive water damage, many torn pages, cover destroyed</p>
                                <p className="text-xs text-red-700 mt-1"><strong>Charge:</strong> 60-80% of book price (e.g., 675,000 - 900,000 đ for a 1,125,000 đ book)</p>
                            </div>
                            
                            <div className="bg-gray-800 border-l-4 border-gray-900 p-4 rounded text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">✗ LOST / Destroyed</span>
                                    <span className="font-bold">100%</span>
                                </div>
                                <p className="text-sm">Book is completely lost or destroyed beyond repair</p>
                                <p className="text-xs text-gray-300 mt-1"><strong>Charge:</strong> 100% of book price + 50,000 đ processing fee</p>
                                <p className="text-xs text-yellow-300 mt-2">Example: Lost a 1,125,000 đ book = 1,125,000 + 50,000 = 1,175,000 đ total</p>
                            </div>
                        </div>
                        
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700">
                                <strong className="text-blue-800">⚠️ Important:</strong> Always report any pre-existing damage when borrowing to avoid being charged. 
                                The librarian will note the condition at checkout.
                            </p>
                        </div>
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