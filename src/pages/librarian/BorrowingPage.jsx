import React, { useState } from 'react';
import BorrowingRow from '../../components/BorrowingRow.jsx';
import { mockBorrowing } from '../../data/mockBorrowing.js';

const BorrowingPage = () => {
    const [borrowedBooks, setBorrowedBooks] = useState(mockBorrowing);
    return (
        <div className="p-4 sm:p-6 min-h-screen font-sans">

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Current Borrowing</h2>
            </div>

            {/* Column Headers */}
            <div className="hidden sm:flex items-center text-xs font-semibold uppercase text-gray-600 bg-gray-200 py-3 px-4 rounded-lg mb-3 shadow-inner sticky top-0 z-10">
                <div className="w-[40%]">Title</div>
                <div className="w-[20%]">User</div>
                <div className="w-[20%]">Return Date</div>
                <div className="w-[20%]">Status</div>
            </div>

            <div className="space-y-4">
                {borrowedBooks.length > 0 ? (
                    borrowedBooks.map((borrow) => (
                        <BorrowingRow
                            key={borrow.id}
                            borrow={borrow}
                        />
                    ))
                ) : (
                    <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-md">
                        <p className="text-gray-500 text-lg font-medium">No books are currently checked out. The library is quiet! 😌</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BorrowingPage;