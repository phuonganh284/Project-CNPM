import React, { useState } from 'react';
import BorrowCard from '../../components/BorrowCard';
import { mockBorrows } from '../../data/mockBorrows';

const RenewCalendarModal = ({ book, onConfirm, onCancel }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };
    const getMaxDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 14);
        return today.toISOString().split('T')[0];
    };

    const handleConfirm = () => {
        if (selectedDate) onConfirm(book, selectedDate);
    };

    return (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 text-blue-600">Select Renewal Date</h3>
                <p className="text-gray-700 mb-1">Book:</p>
                <p className="text-md font-semibold mb-4 italic">"{book.title}"</p>
                <p className="text-gray-700 mb-1">Current due date:</p>
                <p className="text-md font-semibold mb-4">{book.returnDue}</p>

                <label htmlFor="renewDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select new due date (max. 14 days):
                </label>
                <input
                    type="date"
                    id="renewDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={onCancel} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate}
                        className={`px-4 py-2 text-sm text-white rounded transition-colors ${
                            !selectedDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        Confirm Renew
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReturnConfirmModal = ({ book, onConfirm, onCancel }) => (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Return Request Confirmation</h3>
            <p className="text-gray-600 mb-8">
                Are you sure you want to return this book?
                <br />
                <span className="font-semibold italic">"{book.title}"</span>
            </p>
            <div className="flex flex-col space-y-3">
                <button
                    onClick={() => onConfirm(book)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Confirm
                </button>
                <button
                    onClick={onCancel}
                    className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

const MyBorrowsPage = () => {
    const [borrows, setBorrows] = useState(mockBorrows);
    const [bookToRenew, setBookToRenew] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [bookToReturn, setBookToReturn] = useState(null);

    const handleConfirmRenew = (book, newDate) => {
        const updated = borrows.map(b =>
            b.id === book.id ? { ...b, renewed: true, returnDue: newDate, isOverdue: false } : b
        );
        setBorrows(updated);
        setBookToRenew(null);
        setSuccessMessage(`Book "${book.title}" has been renewed until ${newDate}!`);
    };

    const handleConfirmReturn = (book) => {
        const updated = borrows.map(b =>
            b.id === book.id ? { ...b, isPendingReturn: true, isOverdue: false } : b
        );
        setBorrows(updated);
        setBookToReturn(null);
    };

    return (
        <div className="p-6 min-h-screen relative">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Borrows</h2>

        <div className="fixed bottom-6 right-8 flex flex-col items-end space-y-2 z-50 pr-10">

          <div className="flex items-center bg-red-50 border border-red-200 rounded-md px-3 py-1 shadow-md">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
            <p className="text-sm text-gray-800">Overdue</p>
          </div>
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-3 py-1 shadow-md">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>
            <p className="text-sm text-gray-800">Pending return</p>
          </div>
          <div className="flex items-center bg-green-50 border border-green-200 rounded-md px-3 py-1 shadow-md">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
            <p className="text-sm text-gray-800">Already renewed once</p>
          </div>
        </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {borrows.length ? (
                    borrows.map(b => (
                        <BorrowCard
                            key={b.id}
                            borrow={b}
                            onRenewClick={setBookToRenew}
                            onReturnClick={setBookToReturn}
                        />
                    ))
                ) : (
                    <p className="text-gray-600 text-lg">You currently have no active borrows.</p>
                )}
            </div>

            {bookToRenew && (
                <RenewCalendarModal
                    book={bookToRenew}
                    onConfirm={handleConfirmRenew}
                    onCancel={() => setBookToRenew(null)}
                />
            )}
            {bookToReturn && (
                <ReturnConfirmModal
                    book={bookToReturn}
                    onConfirm={handleConfirmReturn}
                    onCancel={() => setBookToReturn(null)}
                />
            )}
            {successMessage && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSuccessMessage('')}>
                    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800">Success!</h3>
                        <p className="text-gray-600 mb-6">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage('')}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBorrowsPage;
