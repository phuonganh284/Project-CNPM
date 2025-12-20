import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import borrowingService from '../../services/borrowingService';

// Helper function for safe date formatting
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  // Force DD/MM/YYYY format
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const BorrowingHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await borrowingService.getBorrowingHistory();
        setHistory(data.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        const errorMessage = err.response?.data?.message || 'An unexpected error occurred while fetching your borrowing history. Please try again.';
        setError(errorMessage);
        setHistory([]); // Ensure data is empty on error
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter history by status
  const filteredHistory = filterStatus === 'All' 
    ? history 
    : history.filter(record => 
        filterStatus === 'On Time' 
          ? record.status === 'on-time' 
          : record.status === 'overdue'
      );

  const totalCharges = history.reduce((sum, record) => sum + (parseFloat(record.totalCharge) || 0), 0);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading borrowing history...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Borrowing History</h1>
        <p className="text-sm text-gray-600">View your complete borrowing history and track any charges.</p>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-4">{error}</p>
      )}

      {history.length === 0 && !error ? (
        <div className="text-center p-10 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">You have no borrowing history yet.</p>
            <p className="text-gray-400 text-sm mt-2">Once you borrow and return books, your history will appear here.</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Total Books Borrowed</p>
              <p className="text-2xl font-bold text-gray-800">{history.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Returned On Time</p>
              <p className="text-2xl font-bold text-green-600">
                {history.filter(r => r.status === 'on-time').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Total Charges</p>
              <p className="text-2xl font-bold text-red-600">{totalCharges.toLocaleString()}đ</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('All')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({history.length})
              </button>
              <button
                onClick={() => setFilterStatus('On Time')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'On Time'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On Time ({history.filter(r => r.status === 'on-time').length})
              </button>
              <button
                onClick={() => setFilterStatus('Late')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'Late'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Late ({history.filter(r => r.status === 'overdue').length})
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-9 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
              <div className="col-span-3">Book</div>
              <div className="col-span-1">Copy</div>
              <div className="col-span-1">Borrowed</div>
              <div className="col-span-1">Due Date</div>
              <div className="col-span-1">Assessed Condition</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Total Charge</div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => {
                  const totalCharge = parseFloat(record.totalCharge) || 0;
                  const coverUrl = record.book?.coverImageUrl || null;

                  return (
                    <div
                      key={record.id}
                      className="grid grid-cols-9 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={record.book?.title || 'Book cover'}
                            className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/book/${record.book?.id}`)}
                            onError={(e) => { e.currentTarget.style.display = 'none'; const parent = e.currentTarget.parentElement; if(parent) { const div = document.createElement('div'); div.className = 'w-10 h-14 bg-gray-200 rounded shadow-sm flex-shrink-0 flex items-center justify-center text-xs text-gray-500'; div.innerText = 'Error'; parent.insertBefore(div, e.currentTarget); } }}
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-200 rounded shadow-sm flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                            No Cover
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-0.5 truncate text-sm">
                            {record.book?.title || '-'}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{record.book?.author || '-'}</p>
                        </div>
                      </div>
                      <div className="col-span-1 text-gray-600 text-sm font-mono">{record.copyId || '-'}</div>
                      <div className="col-span-1 text-gray-600 text-xs">{formatDate(record.borrowDate)}</div>
                      <div className="col-span-1 text-gray-600 text-xs">{formatDate(record.dueDate)}</div>
                      <div className="col-span-1 text-gray-600 text-sm font-semibold">
                        {record.finalAssessedCondition != null
                          ? `${parseFloat(record.finalAssessedCondition).toFixed(0)}%`
                          : record.librarianAssessedCondition || '-'}
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${
                          record.status === 'on-time'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'on-time' ? 'On Time' : 'Late'}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-red-600 font-semibold text-sm">{totalCharge.toLocaleString()}đ</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No records found for this filter.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BorrowingHistoryPage;