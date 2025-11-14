import React, { useState, useEffect } from 'react';
import BorrowingRow from '../../components/BorrowingRow.jsx';
import borrowingService from '../../services/borrowingService.js';

const BorrowingPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const data = await borrowingService.getAllBorrowings();
      setBorrowedBooks(data.data);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching borrowings. Please try again.';
      setError(errorMessage);
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading current borrowings...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Current Borrowing</h2>
        <button
          onClick={fetchBorrowings}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* Column Headers */}
      <div className="hidden sm:flex items-center text-sm font-medium text-gray-600 bg-[#F3F3F7] py-3 px-6 mb-4 sticky top-0 z-10">
        <div className="w-[30%]">Title</div>
        <div className="w-[15%]">User</div>
        <div className="w-[10%]">Copy ID</div>
        <div className="w-[15%]">Condition</div>
        <div className="w-[15%]">Return Date</div>
        <div className="w-[15%]">Status</div>
      </div>

      <div className="space-y-4">
        {borrowedBooks.length > 0 ? (
          borrowedBooks.map((borrow) => (
            <BorrowingRow key={borrow.id} borrow={borrow} />
          ))
        ) : (
          !error && (
            <div className="text-center p-10">
              <p className="text-gray-500 text-lg font-medium">
                No books are currently checked out.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BorrowingPage;
